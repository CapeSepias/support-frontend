package com.gu.zuora

import com.gu.i18n.Currency.GBP
import com.gu.monitoring.SafeLogger
import com.gu.support.workers.model.PaymentFields
import com.gu.zuora.Fixtures._
import com.gu.zuora.encoding.CustomCodecs._
import com.gu.zuora.model.response._
import com.gu.zuora.model.{ContributionRatePlanCharge, DiscountRatePlanCharge}
import com.typesafe.scalalogging.LazyLogging
import io.circe
import io.circe.parser._
import io.circe.syntax._
import org.scalatest.{FlatSpec, Matchers}

class SerialisationSpec extends FlatSpec with Matchers with LazyLogging {

  "Account" should "serialise to correct json" in {
    val json = account(GBP).asJson
    (json \\ "Currency").head.asString should be(Some("GBP"))
    (json \\ "PaymentGateway").head.asString should be(Some("Stripe Gateway 1"))
  }

  "PaymentMethod" should "serialise to correct json" in {
    val json = creditCardPaymentMethod.asJson
  }

  "PaymentFields" should "deserialise correctly" in {
    val ddFields = decode[PaymentFields](directDebitPaymentFieldsJson)
    ddFields.isRight should be(true)
  }

  "SubscribeRequest" should "serialise to correct json" in {
    val json = creditCardSubscriptionRequest().asJson
    (json \\ "GenerateInvoice").head.asBoolean should be(Some(true))
    (json \\ "sfContactId__c").head.asString.get should be(salesforceId)
  }

  "DiscountRatePlanCharge" should "serialise and deserialize correctly" in {
    val correct = parse("""{
      "ProductRatePlanChargeId" : "12345",
      "DiscountPercentage" : 15.0,
      "UpToPeriods" : 3,
      "UpToPeriodsType" : "Months",
      "EndDateCondition" : "FixedPeriod"
    }""").right.get
    val rpc = DiscountRatePlanCharge("12345", upToPeriods = 3, discountPercentage = 15)

    rpc.asJson should be(correct)

    correct.as[DiscountRatePlanCharge].fold(
      err => fail(err),
      c => {
        c.productRatePlanChargeId shouldBe "12345"
        c.upToPeriods shouldBe 3
        c.discountPercentage shouldBe 15
      }
    )
  }

  "ContributionRatePlanCharge" should "serialise and deserialize correctly" in {
    val correct = parse("""{
      "ProductRatePlanChargeId" : "12345",
      "Price" : 15,
      "EndDateCondition" : "SubscriptionEnd"
    }""").right.get
    val rpc = ContributionRatePlanCharge("12345", price = 15)

    rpc.asJson should be(correct)

    correct.as[ContributionRatePlanCharge].fold(
      err => fail(err),
      c => {
        c.productRatePlanChargeId shouldBe "12345"
        c.price shouldBe 15
      }
    )
  }

  "InvoiceResult" should "deserialise correctly" in {
    val decodeResponse = decode[InvoiceResult](invoiceResult)
    decodeResponse.isRight should be(true)
  }

  "SubscribeResponseAccount" should "deserialise correctly" in {
    val decodeResponse = decode[SubscribeResponseAccount](subscribeResponseAccount)
    decodeResponse.fold(
      err => fail(err.toString),
      _ => succeed
    )
  }

  "SubscribeResponse" should "deserialise correctly" in {
    val decodeResponse = decode[List[SubscribeResponseAccount]](subscribeResponseAnnual)
    decodeResponse.isRight should be(true)
  }

  "GetAccountResponse" should "deserialise from json" in {
    val decodeResult = decode[GetAccountResponse](Fixtures.getAccountResponse)
    decodeResult.isRight should be(true)
    decodeResult.right.get.basicInfo.accountNumber should be(Fixtures.accountNumber)
  }

  "Error" should "deserialise correctly" in {

    val decodeResult = decode[ZuoraError](Fixtures.error)
    decodeResult.isRight should be(true)
    decodeResult.right.get.Code should be("53100320")
  }

  "ErrorResponse" should "deserialise correctly" in {
    //The Zuora api docs say that the subscribe action returns a ZuoraErrorResponse
    //but actually it returns a list of those.
    val decodeResult = decode[List[ZuoraErrorResponse]](Fixtures.errorResponse)
    decodeResult match {
      case r: Right[circe.Error, List[ZuoraErrorResponse]] => SafeLogger.info("right")
      case l: Left[circe.Error, List[ZuoraErrorResponse]] => SafeLogger.info("left")
    }
    decodeResult.isRight should be(true)
    decodeResult.right.get.head.errors.size should be(1)
    decodeResult.right.get.head.errors.head.Code should be("MISSING_REQUIRED_VALUE")
  }

}
