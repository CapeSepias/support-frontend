package com.gu.salesforce

import com.gu.config.{Stage, TouchpointConfig, TouchpointConfigProvider}
import com.typesafe.config.Config

case class SalesforceConfig(
  stage: String,
  url: String,
  key: String,
  secret: String,
  username: String,
  password: String,
  token: String
) extends TouchpointConfig

class SalesforceConfigProvider(defaultStage: Stage, config: Config) extends TouchpointConfigProvider[SalesforceConfig](defaultStage, config) {
  def fromConfig(config: com.typesafe.config.Config): SalesforceConfig = SalesforceConfig(
    stage = config.getString("stage"),
    url = config.getString("salesforce.url"),
    key = config.getString("salesforce.consumer.key"),
    secret = config.getString("salesforce.consumer.secret"),
    username = config.getString("salesforce.api.username"),
    password = config.getString("salesforce.api.password"),
    token = config.getString("salesforce.api.token")
  )
}
