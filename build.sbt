import SeleniumTestConfig.SeleniumTest
import sbt.Keys.{publishTo, resolvers, scalaVersion, skip, updateOptions, organization}
import sbtrelease.ReleaseStateTransformations._

import scala.sys.process._

val scalatest = "org.scalatest" %% "scalatest" % "3.2.2"

lazy val integrationTestSettings: Seq[Def.Setting[_]] = Defaults.itSettings ++ Seq(
  scalaSource in IntegrationTest := baseDirectory.value / "src" / "test" / "scala",
  javaSource in IntegrationTest := baseDirectory.value / "src" / "test" / "java",
  resourceDirectory in IntegrationTest := baseDirectory.value / "src" / "test" / "resources",
  testOptions in Test += Tests.Argument(TestFrameworks.ScalaTest, "-l", "com.gu.test.tags.annotations.IntegrationTest"),
  libraryDependencies += scalatest % "it",
)

lazy val release = Seq[ReleaseStep](
  checkSnapshotDependencies,
  inquireVersions,
  runClean,
  runTest,
  setReleaseVersion,
  commitReleaseVersion,
  tagRelease,
  ReleaseStep(action = Command.process("publishSigned", _), enableCrossBuild = false),
  ReleaseStep(action = Command.process("sonatypeReleaseAll", _), enableCrossBuild = false),
  setNextVersion,
  commitNextVersion,
  pushChanges
)

inThisBuild(Seq(
  organization := "com.gu",
  scalaVersion := "2.12.12",
  dependencyTree / aggregate := false,
  // https://www.scala-sbt.org/1.x/docs/Cached-Resolution.html
  updateOptions := updateOptions.value.withCachedResolution(true),
  resolvers ++= Seq(Resolver.sonatypeRepo("releases")), // libraries that haven't yet synced to maven central
  scalacOptions += "-Ypartial-unification",
))

lazy val releaseSettings = Seq(
  isSnapshot := false,
  publishTo := {
    val nexus = "https://oss.sonatype.org/"
    if (isSnapshot.value)
      Some("snapshots" at nexus + "content/repositories/snapshots")
    else
      Some("releases" at nexus + "service/local/staging/deploy/maven2")
  },
  licenses := Seq("Apache V2" -> url("http://www.apache.org/licenses/LICENSE-2.0.html")),
  releaseProcess := release,
  releaseUseGlobalVersion := false,
  releaseVersionFile := file(name.value + "/version.sbt"),
  scmInfo := Some(ScmInfo(
    url("https://github.com/guardian/support-frontend"),
    "scm:git:git@github.com:guardian/support-frontend.git"
  )),
)

lazy val commonDependencies = Seq(
  "com.typesafe" % "config" % "1.3.2",
  scalatest % "test",
  "com.typesafe.scala-logging" %% "scala-logging" % "3.9.2"
)

lazy val root = (project in file("."))
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype, AssemblyPlugin)
  .settings(
    name := "support-frontend-root",
    moduleName := "support-frontend-root",
    publish / skip := true,
  )
  .aggregate(
    `support-frontend`,
    `support-workers`,
    `support-models`,
    `support-config`,
    `support-internationalisation`,
    `support-services`,
    `stripe-intent`,
    `support-redemptiondb`,
    `it-test-runner`,
    `module-aws`,
    `module-rest`,
    `support-payment-api`,
    `acquisition-event-producer`
  )

lazy val testScalastyle = taskKey[Unit]("testScalastyle")

lazy val `support-frontend` = (project in file("support-frontend"))
  .enablePlugins(PlayScala, BuildInfoPlugin, RiffRaffArtifact, JDebPackaging).disablePlugins(ReleasePlugin, SbtPgp, Sonatype)
  .configs(SeleniumTest)
  .settings(
    inConfig(SeleniumTest)(Defaults.testTasks),
    buildInfoKeys := BuildInfoSettings.buildInfoKeys,
    buildInfoPackage := "app",
    buildInfoOptions += BuildInfoOption.ToMap,
    scalastyleFailOnError := true,
    testScalastyle := scalastyle.in(Compile).toTask("").value,
    (test in Test) := ((test in Test) dependsOn testScalastyle).value,
    (testOnly in Test) := ((testOnly in Test) dependsOn testScalastyle).evaluated,
    (testQuick in Test) := ((testQuick in Test) dependsOn testScalastyle).evaluated,
  ).dependsOn(`support-services`, `support-models`, `support-config`, `support-internationalisation`)
  .aggregate(`support-services`, `support-models`, `support-config`, `support-internationalisation`)

lazy val `support-workers` = (project in file("support-workers"))
  .enablePlugins(RiffRaffArtifact).disablePlugins(ReleasePlugin, SbtPgp, Sonatype)
  .configs(IntegrationTest)
  .settings(
    integrationTestSettings,
    libraryDependencies ++= commonDependencies
  ).dependsOn(`support-services`, `support-models` % "test->test;it->test;compile->compile", `support-config`, `support-internationalisation`, `acquisition-event-producer`)
  .aggregate(`support-services`, `support-models`, `support-config`, `support-internationalisation`, `stripe-intent`, `acquisition-event-producer`)

lazy val `support-payment-api` = (project in file("support-payment-api"))
  .enablePlugins(RiffRaffArtifact, SystemdPlugin, PlayService, RoutesCompiler, JDebPackaging, BuildInfoPlugin)
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype)
  .settings(
    buildInfoKeys := BuildInfoSettings.buildInfoKeys,
    buildInfoPackage := "app",
    buildInfoOptions += BuildInfoOption.ToMap,
    libraryDependencies ++= commonDependencies
  ).dependsOn(`support-models`, `support-internationalisation`)
  .aggregate(`support-models`, `support-internationalisation`)

lazy val `support-models` = (project in file("support-models"))
  .configs(IntegrationTest)
  .settings(
    releaseSettings,
    integrationTestSettings,
    libraryDependencies ++= commonDependencies
  ).dependsOn(`support-internationalisation`, `acquisition-event-producer`)
  .aggregate(`support-internationalisation`)

lazy val `support-config` = (project in file("support-config"))
  .configs(IntegrationTest)
  .settings(
    releaseSettings,
    integrationTestSettings,
    libraryDependencies ++= commonDependencies
  ).dependsOn(`support-models`, `support-internationalisation`)
  .aggregate(`support-models`, `support-internationalisation`)

lazy val `support-services` = (project in file("support-services"))
  .configs(IntegrationTest)
  .settings(
    releaseSettings,
    integrationTestSettings,
    libraryDependencies ++= commonDependencies
  ).dependsOn(`support-internationalisation`, `support-models`, `support-config`, `module-rest`, `module-aws`)
  .aggregate(`support-internationalisation`, `support-models`, `support-config`, `module-rest`, `module-aws`)

lazy val `module-rest` = (project in file("support-modules/rest"))
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype, AssemblyPlugin)
  .settings(
    libraryDependencies ++= commonDependencies
  )

lazy val `module-aws` = (project in file("support-modules/aws"))
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype, AssemblyPlugin)
  .settings(
    libraryDependencies ++= commonDependencies
  )

lazy val `support-internationalisation` = (project in file("support-internationalisation"))
  .configs(IntegrationTest)
  .settings(
    releaseSettings,
    integrationTestSettings,
    libraryDependencies ++= commonDependencies
  )

lazy val `acquisition-event-producer` = (project in file("acquisition-event-producer"))
  .settings(
    licenses += ("MIT", url("http://opensource.org/licenses/MIT")),
    bintrayOrganization := Some("guardian"),
    bintrayRepository := "ophan",
    publishMavenStyle := true,
    addCompilerPlugin("org.scalamacros" % "paradise" % "2.1.1" cross CrossVersion.full), // for simulacrum
    libraryDependencies ++= Seq(
      "com.gu" %% "ophan-event-model" % "0.0.17" excludeAll ExclusionRule(organization = "com.typesafe.play"),
      "com.gu" %% "fezziwig" % "1.3",
      "com.typesafe.play" %% "play-json" % "2.6.14",
      "io.circe" %% "circe-core" % "0.12.1",
      "ch.qos.logback" % "logback-classic" % "1.2.3",
      "com.gu" %% "acquisitions-value-calculator-client" % "2.0.5",
      "com.squareup.okhttp3" % "okhttp" % "3.9.0",
      "com.typesafe.scala-logging" %% "scala-logging" % "3.9.2",
      "org.typelevel" %% "simulacrum" % "1.0.0",
      "org.scalatest" %% "scalatest" % "3.1.1" % "test",
      "org.scalactic" %% "scalactic" % "3.1.1",
      "org.typelevel" %% "cats-core" % "2.1.1",
      "com.amazonaws" % "aws-java-sdk-kinesis" % "1.11.465",
      "com.gu" %% "thrift-serializer" % "4.0.3"
    )
  )


lazy val `stripe-intent` = (project in file("support-lambdas/stripe-intent"))
  .enablePlugins(RiffRaffArtifact).disablePlugins(ReleasePlugin, SbtPgp, Sonatype)
  .configs(IntegrationTest)
  .settings(
    integrationTestSettings,
    libraryDependencies ++= commonDependencies,
  ).dependsOn(`module-rest`, `support-config`, `module-aws`)
  .aggregate(`module-rest`, `support-config`, `module-aws`)

lazy val `support-redemptiondb` = (project in file("support-redemptiondb"))
  .enablePlugins(RiffRaffArtifact).disablePlugins(ReleasePlugin, SbtPgp, Sonatype, AssemblyPlugin)

lazy val `it-test-runner` = (project in file("support-lambdas/it-test-runner"))
  .enablePlugins(RiffRaffArtifact).disablePlugins(ReleasePlugin, SbtPgp, Sonatype)
  .dependsOn(`module-aws`)
