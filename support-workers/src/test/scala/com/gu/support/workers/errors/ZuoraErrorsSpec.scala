package com.gu.support.workers.errors

import java.io.ByteArrayOutputStream

import com.gu.config.Configuration
import com.gu.monitoring.SafeLogger
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.services.ServiceProvider
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.encoding.ErrorJson
import com.gu.support.workers.JsonFixtures.{createContributionZuoraSubscriptionJson, wrapFixture}
import com.gu.support.workers.exceptions.{RetryNone, RetryUnlimited}
import com.gu.support.workers.lambdas.CreateZuoraSubscription
import com.gu.support.workers.{JsonFixtures, JsonWrapper, LambdaSpec}
import com.gu.support.zuora.api.response.ZuoraErrorResponse
import com.gu.test.tags.annotations.IntegrationTest
import com.gu.zuora.Fixtures.{incorrectPaymentMethod, invalidSubscriptionRequest}
import com.gu.zuora.ZuoraService
import io.circe.generic.auto._
import io.circe.parser.decode
import org.scalatest.RecoverMethods

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

@IntegrationTest
class ZuoraErrorsSpec extends LambdaSpec with MockWebServerCreator with MockServicesCreator with RecoverMethods {
  "Subscribe request with invalid term type" should "fail with a ZuoraErrorResponse" in {
    val zuoraService = new ZuoraService(Configuration.zuoraConfigProvider.get(), configurableFutureRunner(30.seconds))
    recoverToSucceededIf[ZuoraErrorResponse] {
      zuoraService.subscribe(invalidSubscriptionRequest).map {
        response =>
          SafeLogger.info(s"response: $response")
      }
    }
  }

  "Subscribe request with incorrect PaymentMethod" should "fail with a ZuoraErrorResponse" in {
    val zuoraService = new ZuoraService(Configuration.zuoraConfigProvider.get(), configurableFutureRunner(30.seconds))
    recoverToSucceededIf[ZuoraErrorResponse] {
      zuoraService.subscribe(incorrectPaymentMethod).map {
        response =>
          SafeLogger.info(s"response: $response")
      }
    }
  }

  "Timeouts from Zuora" should "throw a RetryUnlimited" in {
    val createZuoraSubscription = new CreateZuoraSubscription(timeoutServices)
    val outputStream = new ByteArrayOutputStream()
    a[RetryUnlimited] should be thrownBy {
      createZuoraSubscription.handleRequest(wrapFixture(createContributionZuoraSubscriptionJson()), outputStream, context)
    }
  }

  "500s from Zuora" should "throw a RetryUnlimited" in {
    val server = createMockServer(500, "Uh Oh!")
    val baseUrl = server.url("/v1")
    val services = errorServices(Some(baseUrl.toString))

    val createZuoraSubscription = new CreateZuoraSubscription(services)

    val outStream = new ByteArrayOutputStream()

    a[RetryUnlimited] should be thrownBy {
      createZuoraSubscription.handleRequest(wrapFixture(createContributionZuoraSubscriptionJson()), outStream, context)
    }

    server.shutdown()
  }

  "200s with success = false from Zuora and a trnasient error" should "throw a RetryUnlimited" in {

    val zuoraSubscribeError: String =
      """
        |[{
        |  "Success": false,
        |  "Errors": [{
        |    "Code": "LOCK_COMPETITION",
        |    "Message": "This error will go away if you retry"
        |  }]
        |}]
        |""".stripMargin

    val server = createMockServer(200, zuoraSubscribeError)
    val baseUrl = server.url("/v1")
    val services = errorServices(Some(baseUrl.toString))

    val createZuoraSubscription = new CreateZuoraSubscription(services)

    val outStream = new ByteArrayOutputStream()

    a[RetryUnlimited] should be thrownBy {
      createZuoraSubscription.handleRequest(wrapFixture(createContributionZuoraSubscriptionJson()), outStream, context)
    }

    server.shutdown()
  }

  "200s with success = false from Zuora and a permanent error" should "throw a RetryNone" in {

    val zuoraSubscribeError: String =
      """
        |[{
        |  "Success": false,
        |  "Errors": [{
        |    "Code": "INVALID_VALUE",
        |    "Message": "There's no use retrying this error, it won't work ever"
        |  }]
        |}]
        |""".stripMargin

    val server = createMockServer(200, zuoraSubscribeError)
    val baseUrl = server.url("/v1")
    val services = errorServices(Some(baseUrl.toString))

    val createZuoraSubscription = new CreateZuoraSubscription(services)

    val outStream = new ByteArrayOutputStream()

    a[RetryNone] should be thrownBy {
      createZuoraSubscription.handleRequest(wrapFixture(createContributionZuoraSubscriptionJson()), outStream, context)
    }

    server.shutdown()
  }

  "JsonWrapped error" should "deserialise correctly" in {

    val zuoraErrorResponse = for {
      wrapper <- decode[JsonWrapper](JsonFixtures.cardDeclinedJsonZuora).toOption
      executionError <- wrapper.error
      errorJson <- decode[ErrorJson](executionError.Cause).toOption
      zuoraErrorResponse <- decode[ZuoraErrorResponse](errorJson.errorMessage).toOption
    } yield zuoraErrorResponse

    zuoraErrorResponse.get.errors.head.Code should be("TRANSACTION_FAILED")
  }

  private val timeoutServices = errorServices(None, 1.milliseconds)

  def errorServices(baseUrl: Option[String], timeout: Duration = 10.seconds): ServiceProvider = mockService(
    s => s.zuoraService,
    new ZuoraService(Configuration.zuoraConfigProvider.get(), configurableFutureRunner(timeout), baseUrl)
  )

}
