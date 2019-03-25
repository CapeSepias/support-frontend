package model.acquisition

import com.gu.acquisition.model.{GAData, OphanIds}
import com.gu.acquisition.typeclasses.AcquisitionSubmissionBuilder
import model.subscribewithgoogle.GoogleRecordPayment
import ophan.thrift.event.{Acquisition, PaymentFrequency, Product}

case class SubscribeWithGoogleAcquisition(googleRecordPayment: GoogleRecordPayment,
                                          identityId: Long) {
}

object SubscribeWithGoogleAcquisition {
  implicit val submissionBuilder: AcquisitionSubmissionBuilder[SubscribeWithGoogleAcquisition] =
    new AcquisitionSubmissionBuilder[SubscribeWithGoogleAcquisition] {
      override def buildOphanIds(a: SubscribeWithGoogleAcquisition): Either[String, OphanIds] = Right(OphanIds(None, None, None))

      override def buildAcquisition(a: SubscribeWithGoogleAcquisition): Either[String, Acquisition] = Right(Acquisition(
        product = Product.Contribution,
        paymentFrequency = PaymentFrequency.OneOff,
        currency = a.googleRecordPayment.currency,
        amount = a.googleRecordPayment.amount.toDouble,
        paymentProvider = Some(ophan.thrift.event.PaymentProvider.SubscribeWithGoogle)
      ))

      override def buildGAData(a: SubscribeWithGoogleAcquisition): Either[String, GAData] = Right(GAData(
        "???",
        "???",
        None,
        None
      ))
    }
}
