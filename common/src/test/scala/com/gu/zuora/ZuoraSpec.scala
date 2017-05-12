package com.gu.zuora

import com.gu.config.Configuration
import com.gu.okhttp.RequestRunners
import com.gu.zuora.Fixtures.subscriptionRequest
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.{ AsyncFlatSpec, Matchers }

import scala.concurrent.duration._

class ZuoraSpec extends AsyncFlatSpec with Matchers with LazyLogging {

  "ZuoraService" should "retrieve an account" in {
    val zuoraService = new ZuoraService(Configuration.zuoraConfig, RequestRunners.configurableFutureRunner(10.seconds))
    zuoraService.getAccount(Fixtures.accountNumber).map {
      response =>
        response.success should be(true)
        response.basicInfo.accountNumber should be(Fixtures.accountNumber)
    }
  }

  "Subscribe request" should "succeed" in {
    val zuoraService = new ZuoraService(Configuration.zuoraConfig, RequestRunners.configurableFutureRunner(30.seconds))
    zuoraService.subscribe(subscriptionRequest).map {
      response =>
        logger.info(s"$response")
        response.head.success should be(true)
    }
  }
}
