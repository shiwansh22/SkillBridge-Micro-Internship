Upgrade to Java 21

Summary
- pom.xml updated to set <java.version>21</java.version> and maven-compiler-plugin configured to release 21.

What changed
- Updated `java.version` property to 21.
- Set maven-compiler-plugin version to 3.11.0 and <release>${java.version}</release> to compile to Java 21.

Local verification (Windows PowerShell)
1. Install JDK 21
- Download Eclipse Temurin / Adoptium or another JDK 21 distribution and install it.
- Example: install from https://adoptium.net

2. Set JAVA_HOME and update PATH (PowerShell)
$env:JAVA_HOME = 'C:\Program Files\Eclipse Adoptium\jdk-21'  # adjust path to your install
$env:Path = $env:JAVA_HOME + '\bin;' + $env:Path

3. Verify java version
java -version

Expected output should show Java 21.

4. Build the project with Maven (from repository root)
cd SkillBridgeBackend
mvn -U clean package

Notes and troubleshooting
- If Maven fails due to incompatible dependencies, check Spring Boot parent version (currently 3.5.6). Spring Boot 3.x supports Java 17+, but verify compatibility with Java 21; consider upgrading Spring Boot if you encounter runtime issues.
- Lombok: make sure IDE annotation processing is enabled and Lombok dependency is present (it is optional in pom but used by project).
- If you use IDE-managed JDKs, configure the project SDK to JDK 21 in your IDE settings.

Next steps
- Run unit tests and fix any runtime or compilation issues.
- If CI uses a different JDK, update CI configuration to use JDK 21.
