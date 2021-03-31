package com.gu.stripe

import com.gu.support.workers.PaymentMethodId
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder
import cats.syntax.functor._

import scala.concurrent.Future

object getPaymentMethod {

  sealed trait StripePaymentMethod

  object StripePaymentMethod {
    val cardDecoder = deriveDecoder[StripeCardPaymentMethod]
    val sepaDecoder = deriveDecoder[StripeSepaPaymentMethod]

    implicit val decoder: Decoder[StripePaymentMethod] = cardDecoder.widen or sepaDecoder.widen
  }
  case class StripeCardPaymentMethod(
    card: StripeCard
  ) extends StripePaymentMethod

  case class StripeSepaPaymentMethod(
    sepa_debit: SepaDebit,
  ) extends StripePaymentMethod


  object StripeCard {

    implicit val brandDecoder = StripeBrand.decoder(_.paymentMethodValue)
    implicit val decoder: Decoder[StripeCard] = deriveDecoder

  }

  case class StripeCard(brand: StripeBrand, last4: String, exp_month: Int, exp_year: Int, country: String)

  object SepaDebit {
    implicit val decoder: Decoder[SepaDebit] = deriveDecoder
  }

  case class SepaDebit(
    bank_code: String,
    branch_code: String,
    country: String,
    fingerprint: String,
    last4: String
  )

  def apply(stripeService: StripeServiceForCurrency)(paymentMethod: PaymentMethodId): Future[StripePaymentMethod] =
    stripeService.get[StripePaymentMethod](s"payment_methods/${paymentMethod.value}")

}
