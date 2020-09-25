package com.gu.support.redemption

import com.gu.support.redemption.corporate.CorporateCodeValidator.CorporateId

sealed abstract class CodeValidationResult(val clientCode: String){
  def isValid = false
}

sealed abstract class ValidCode(clientCode: String) extends CodeValidationResult(clientCode) {
  override def isValid = true
}

sealed abstract class InvalidCode(clientCode: String) extends CodeValidationResult(clientCode)

case object CodeNotFound extends CodeValidationResult("code_not_found")

case object CodeMalformed extends InvalidCode("code_malformed")

case object CodeAlreadyUsed extends InvalidCode("code_already_used")

case object CodeExpired extends InvalidCode("code_expired")

case object InvalidReaderType extends InvalidCode("invalid_reader_type")

object ValidGiftCode { val clientCode = "valid_gift_code"}

case class ValidGiftCode(subscriptionId: String) extends ValidCode(ValidGiftCode.clientCode)

// This can happen if Zuora is responding very slowly - a redemption request may succeed but not return a response
// until after the CreateZuoraSubscription lambda has timed out meaning that the redemption will be retried with the
// same requestId. In this case we want the lambda to succeed so that we progress to the next lambda
case object CodeRedeemedInThisRequest extends ValidCode("redeemed_in_this_request")

case class ValidCorporateCode(corporateId: CorporateId) extends ValidCode("valid_corporate_code")
