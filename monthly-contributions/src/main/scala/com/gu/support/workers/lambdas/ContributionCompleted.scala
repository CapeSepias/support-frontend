package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.monitoring.SafeLogger
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.model.monthlyContributions.Status
import com.gu.support.workers.model.monthlyContributions.state.{CompletedState, SendThankYouEmailState}
import com.gu.support.workers.model.{ExecutionError, RequestInfo}

class ContributionCompleted
    extends Handler[SendThankYouEmailState, CompletedState] {

  override protected def handler(state: SendThankYouEmailState, error: Option[ExecutionError], requestInfo: RequestInfo, context: Context) = {
    val fields = List(
      "contribution_amount" -> state.contribution.amount.toString,
      "contribution_currency" -> state.contribution.currency.iso.toString,
      "test_user" -> state.user.isTestUser.toString,
      "payment_method" -> state.paymentMethod.`type`
    )

    SafeLogger.info(fields.map({ case (k, v) => s"$k: $v" }).mkString("SUCCESS ", " ", ""))

    HandlerResult(CompletedState(
      requestId = state.requestId,
      user = state.user,
      contribution = state.contribution,
      status = Status.Success,
      message = None
    ), requestInfo)
  }
}
