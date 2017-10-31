addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.6.6")

addSbtPlugin("com.typesafe.sbt" % "sbt-digest" % "1.1.4")

addSbtPlugin("com.eed3si9n" % "sbt-buildinfo" % "0.7.0")

addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "0.14.5")

libraryDependencies += "org.vafer" % "jdeb" % "1.3" artifacts (Artifact("jdeb", "jar", "jar"))

addSbtPlugin("org.scalastyle" %% "scalastyle-sbt-plugin" % "1.0.0" excludeAll ExclusionRule(organization = "com.danieltrinh"))

addSbtPlugin("org.scalariform" % "sbt-scalariform" % "1.8.1")

addSbtPlugin("com.gu" % "sbt-riffraff-artifact" % "1.1.3")