package com.gu.support.workers

import java.util.UUID

import com.gu.i18n.{Country, Currency}
import com.gu.salesforce.Salesforce.SalesforceContactRecords
import com.gu.support.config.{ZuoraConfig, ZuoraDigitalPackConfig}
import com.gu.support.workers.lambdas.CreateZuoraSubscription
import com.gu.support.workers.states.CreateZuoraSubscriptionState
import com.gu.support.zuora.api.response._
import com.gu.support.zuora.api.{PreviewSubscribeRequest, SubscribeRequest}
import com.gu.support.zuora.domain
import com.gu.zuora.ZuoraSubscribeService
import org.joda.time.{DateTime, LocalDate}
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import scala.concurrent.Future

class CreateZuoraSubscriptionStepsSpec extends AsyncFlatSpec with Matchers {

  it should "create a Digital Pack standard (paid) subscription" in {

    val state = CreateZuoraSubscriptionState(
      requestId = UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
      user = User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
      giftRecipient = None,
      product = DigitalPack(Currency.GBP, Monthly),
      paymentMethod = Left(PayPalReferenceTransaction("baid", "me@somewhere.com")),
      firstDeliveryDate = None,
      promoCode = None,
      salesforceContacts = SalesforceContactRecords(
        buyer = SalesforceContactRecord("sfbuy", "sfbuyacid"),
        giftRecipient = None
      ),
      acquisitionData = None
    )

    val zuora = new ZuoraSubscribeService {
      // not testing retries - these two are empty lists
      override def getAccountFields(identityId: IdentityId, now: DateTime): Future[List[domain.DomainAccount]] = Future(List())
      override def getSubscriptions(accountNumber: ZuoraAccountNumber): Future[List[domain.DomainSubscription]] = Future(List())
      override def previewSubscribe(previewSubscribeRequest: PreviewSubscribeRequest): Future[List[PreviewSubscribeResponse]] = Future(List(
        PreviewSubscribeResponse(
          List(InvoiceDataItem(List(Charge(new LocalDate(2020, 6, 15), new LocalDate(2020, 6, 15), 1.24, 4.56)))),
          true
        )
      ))
      // ideally should also check we called zuora with the right post data
      override def subscribe(subscribeRequest: SubscribeRequest): Future[List[SubscribeResponseAccount]] = Future.successful(List(
        SubscribeResponseAccount("accountdigi", "subdigi", 135.67f, "ididdigi", 246.67f, "aciddigi", true)
      ))
    }

    val result = CreateZuoraSubscription(
      state = state,
      requestInfo = RequestInfo(false, false, Nil, false),
      now = () => new DateTime(2020, 6, 15, 16, 28, 57),
      today = () => new LocalDate(2020, 6, 15),
      promotionService = null,// shouldn't be called for subs with no promo code
      redemptionService = null,// shouldn't be called for paid subs
      zuoraService = zuora,
      config = ZuoraConfig(url = null, username = null, password = null, monthlyContribution = null, annualContribution = null, digitalPack = ZuoraDigitalPackConfig(14, 2))
    )

    result.map { handlerResult =>
      withClue(handlerResult) {
        handlerResult.value.accountNumber should be("accountdigi")
        handlerResult.value.subscriptionNumber should be("subdigi")
        handlerResult.value.paymentMethod.isLeft should be(true) // it's still marked as a paid sub!
      }
    }
  }

}
