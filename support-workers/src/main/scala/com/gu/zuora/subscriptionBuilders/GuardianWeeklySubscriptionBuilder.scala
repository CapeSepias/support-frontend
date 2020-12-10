package com.gu.zuora.subscriptionBuilders

import java.util.UUID

import com.gu.i18n.Country
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.promotions.{DefaultPromotions, PromoCode, PromoError, PromotionService}
import com.gu.support.workers.ProductTypeRatePlans._
import com.gu.support.workers.exceptions.BadRequestException
import com.gu.support.workers.{BillingPeriod, GuardianWeekly, ProductTypeRatePlans, SixWeekly}
import com.gu.support.zuora.api.{Day, Month, ReaderType, SubscriptionData}
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.{applyPromoCodeIfPresent, buildProductSubscription, validateRatePlan}
import org.joda.time.{DateTimeZone, Days, LocalDate}

import scala.util.{Failure, Success, Try}

object GuardianWeeklySubscriptionBuilder {
  def build(
    guardianWeekly: GuardianWeekly,
    requestId: UUID,
    country: Country,
    maybePromoCode: Option[PromoCode],
    firstDeliveryDate: LocalDate,
    promotionService: PromotionService,
    readerType: ReaderType,
    environment: TouchPointEnvironment,
    contractEffectiveDate: LocalDate = LocalDate.now(DateTimeZone.UTC)
  ): Either[PromoError, SubscriptionData] = {

    val recurringProductRatePlanId = validateRatePlan(weeklyRatePlan(guardianWeekly, environment, readerType), guardianWeekly.describe)

    val promotionProductRatePlanId = if (isIntroductoryPromotion(guardianWeekly.billingPeriod, maybePromoCode)) {
      weeklyIntroductoryRatePlan(guardianWeekly, environment).map(_.id).getOrElse(recurringProductRatePlanId)
    } else recurringProductRatePlanId

    val (initialTerm, autoRenew, initialTermPeriodType) = if (readerType == ReaderType.Gift)
      (initialTermInDays(contractEffectiveDate, firstDeliveryDate, guardianWeekly.billingPeriod.monthsInPeriod), false, Day)
    else
      (12, true, Month)

    val subscriptionData = buildProductSubscription(
      requestId,
      recurringProductRatePlanId,
      contractAcceptanceDate = firstDeliveryDate,
      contractEffectiveDate = contractEffectiveDate,
      readerType = readerType,
      autoRenew = autoRenew,
      initialTerm = initialTerm,
      initialTermPeriodType = initialTermPeriodType
    )

    applyPromoCodeIfPresent(promotionService, maybePromoCode, country, promotionProductRatePlanId, subscriptionData)
  }

  private[this] def isIntroductoryPromotion(billingPeriod: BillingPeriod, maybePromoCode: Option[PromoCode]) =
    maybePromoCode.contains(DefaultPromotions.GuardianWeekly.NonGift.sixForSix) && billingPeriod == SixWeekly

  def initialTermInDays(contractEffectiveDate: LocalDate, contractAcceptanceDate: LocalDate, termLengthMonths: Int): Int = {
    val termEnd = contractAcceptanceDate.plusMonths(termLengthMonths)
    Days.daysBetween(contractEffectiveDate, termEnd).getDays
  }
}
