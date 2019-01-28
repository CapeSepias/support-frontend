package com.gu.support.promotions

import cats.syntax.functor._
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import io.circe.syntax._
import io.circe.{Decoder, Encoder}
import org.joda.time.{Days, Months}
import com.gu.support.encoding.CustomCodecs._

sealed trait Benefit

case class DiscountBenefit(amount: Double, durationMonths: Option[Months]) extends Benefit

object DiscountBenefit {
  val jsonName = "percent_discount"

  implicit val discountCodec: Codec[DiscountBenefit] = deriveCodec
}

case class FreeTrialBenefit(duration: Days) extends Benefit

object FreeTrialBenefit {
  val jsonName = "free_trial"

  implicit val freeTrialCodec: Codec[FreeTrialBenefit] = deriveCodec
}

case class IncentiveBenefit(redemptionInstructions: String, legalTerms: Option[String], termsAndConditions: Option[String]) extends Benefit

object IncentiveBenefit {
  val jsonName = "incentive"

  implicit val incentiveCodec: Codec[IncentiveBenefit] = deriveCodec
}

object Benefit {
  implicit val encoder: Encoder[Benefit] = Encoder.instance {
    case d: DiscountBenefit => d.asJson
    case f: FreeTrialBenefit => f.asJson
    case i: IncentiveBenefit => i.asJson
  }

  implicit val decoder: Decoder[Benefit] = List[Decoder[Benefit]](
    Decoder[DiscountBenefit].widen,
    Decoder[FreeTrialBenefit].widen,
    Decoder[IncentiveBenefit].widen
  ).reduceLeft(_ or _)
}
