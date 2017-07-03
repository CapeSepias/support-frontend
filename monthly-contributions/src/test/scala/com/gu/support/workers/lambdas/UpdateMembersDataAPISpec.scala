package com.gu.support.workers.lambdas

import java.io.ByteArrayOutputStream

import com.gu.membersDataAPI.{MembersDataService, UpdateResponse}
import com.gu.salesforce.Fixtures.idId
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.workers.Conversions.FromOutputStream
import com.gu.support.workers.Fixtures.{updateMembersDataAPIJson, wrap}
import com.gu.support.workers.LambdaSpec
import com.gu.support.workers.encoding.Encoding
import org.mockito.Mockito.{times, verify, when}
import org.scalatest.mockito.MockitoSugar

import scala.concurrent.Future

class UpdateMembersDataAPISpec extends LambdaSpec with MockitoSugar {

  "UpdateMembersDataAPI lambda" should "create put request to Members Data API" in {

    val membersDataServiceMock = mock[MembersDataService]

    val serviceProvider = new ServiceProvider {
      override def forUser(isTestUser: Boolean): Services = new Services(true) {
        override lazy val membersDataService = membersDataServiceMock
      }
    }

    when(membersDataServiceMock.update(idId, isTestUser = false))
      .thenReturn(Future.successful(UpdateResponse(true)))

    val updateMembersDataAPI = new UpdateMembersDataAPI(serviceProvider)

    val outStream = new ByteArrayOutputStream()

    updateMembersDataAPI.handleRequest(wrap(updateMembersDataAPIJson), outStream, context)

    Encoding.in[Unit](outStream.toInputStream()).isSuccess should be(true)

    verify(membersDataServiceMock, times(1)).update(idId, isTestUser = false)
  }
}

