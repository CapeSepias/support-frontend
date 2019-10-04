package com.gu.handler

import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.auth.{AWSCredentialsProviderChain, EnvironmentVariableCredentialsProvider, InstanceProfileCredentialsProvider}
import com.amazonaws.regions.Regions
import com.amazonaws.services.s3.model.S3Object
import com.amazonaws.services.s3.{AmazonS3ClientBuilder, AmazonS3URI}
import com.gu.monitoring.SafeLogger
import com.gu.support.config.{Stage, Stages}
import com.typesafe.config.{Config, ConfigFactory}

import scala.io.{BufferedSource, Source}

object Aws {

  val ProfileName = "membership"

  lazy val CredentialsProvider = new AWSCredentialsProviderChain(
    new ProfileCredentialsProvider(ProfileName),
    new InstanceProfileCredentialsProvider(false),
    new EnvironmentVariableCredentialsProvider()
  )

}

object StripeConfigPath {
  def pathForStage(stage: Stage): String = stage match {
    case Stages.DEV => "test"
    case Stages.CODE => "test"
    case Stages.PROD => "live"
  }
  def apply(stage: Stage): AmazonS3URI =
    new AmazonS3URI(s"s3://gu-reader-revenue-private/stripe/${pathForStage(stage)}-stripe-regular.private.conf")
}

object S3Loader {
  def load(uri: AmazonS3URI, public: Config): Config = {
    SafeLogger.info(s"Loading config from S3 from $uri")
    val s3Client = AmazonS3ClientBuilder
      .standard()
      .withCredentials(Aws.CredentialsProvider)
      .withRegion(Regions.EU_WEST_1)
      .build()

    val s3Object: S3Object = s3Client.getObject(uri.getBucket, uri.getKey)

    val source: BufferedSource = Source.fromInputStream(s3Object.getObjectContent)
    try {
      val conf = source.mkString
      ConfigFactory.parseString(conf).withFallback(public)
    } finally {
      source.close()
    }
  }
}
