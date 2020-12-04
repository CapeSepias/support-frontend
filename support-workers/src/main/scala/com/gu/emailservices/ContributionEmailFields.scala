package com.gu.emailservices

import com.gu.emailservices.SubscriptionEmailFieldHelpers.{formatDate, hyphenate, mask}
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.workers._
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailContributionState
import org.joda.time.DateTime

import scala.concurrent.{ExecutionContext, Future}

class ContributionEmailFields(
  getMandate: String => Future[Option[String]],
  created: DateTime,
) {

  def build(contributionProcessedInfo: SendThankYouEmailContributionState)(implicit ec: ExecutionContext): Future[EmailFields] = {
    getPaymentFields(
      contributionProcessedInfo.paymentMethod,
      contributionProcessedInfo.accountNumber,
      created
    ).map { paymentFields =>
      val fields = List(
        "EmailAddress" -> contributionProcessedInfo.user.primaryEmailAddress,
        "created" -> created.toString,
        "amount" -> contributionProcessedInfo.product.amount.toString,
        "currency" -> contributionProcessedInfo.product.currency.identifier,
        "edition" -> contributionProcessedInfo.user.billingAddress.country.alpha2,
        "name" -> contributionProcessedInfo.user.firstName,
        "product" -> s"${contributionProcessedInfo.product.billingPeriod.toString.toLowerCase}-contribution"
      ) ++ paymentFields

      EmailFields(fields, contributionProcessedInfo.user, "regular-contribution-thank-you")
    }
  }

  def getPaymentFields(paymentMethod: PaymentMethod, accountNumber: String, created: DateTime)(implicit ec: ExecutionContext): Future[Seq[(String, String)]] = {
    paymentMethod match {
      case dd: DirectDebitPaymentMethod => getMandate(accountNumber).map(directDebitMandateId => List(
        "account name" -> dd.bankTransferAccountName,
        "account number" -> mask(dd.bankTransferAccountNumber),
        "sort code" -> hyphenate(dd.bankCode),
        "Mandate ID" -> directDebitMandateId.getOrElse(""),
        "first payment date" -> formatDate(created.plusDays(10).toLocalDate),
        "payment method" -> "Direct Debit"
      ))
      case dd: ClonedDirectDebitPaymentMethod => Future.successful(List(
        "account name" -> dd.bankTransferAccountName,
        "account number" -> mask(dd.bankTransferAccountNumber),
        "sort code" -> hyphenate(dd.bankCode),
        "Mandate ID" -> dd.mandateId,
        "first payment date" -> formatDate(created.plusDays(10).toLocalDate),
        "payment method" -> "Direct Debit"
      ))
      case _: PayPalReferenceTransaction => Future.successful(List("payment method" -> "PayPal"))
      case _: CreditCardReferenceTransaction => Future.successful(List("payment method" -> "credit / debit card"))
    }
  }
}
