# DashyBoard.Application.Tests

This project contains **Application tests** (use cases, CQRS).
Tests are written **test-first** and follow a **BDD / scenario-based** naming convention.

The goal is for tests to be easy to read, easy to understand, and serve as documentation for how the system is intended to behave.

---

## Purpose
- We work test-first to clarify requirements and expected behavior before implementation.
- A shared naming and structure standard makes it easy to:
  - understand what is broken when a test fails
  - see where in the flow the error occurs
  - confidently change code without fear

---

## Naming and structure
We name tests based on **what happens in the system**, not how it is implemented.

Names should make it easy to:
- understand the purpose of the test
- immediately see the cause when a test fails

---

## File and folder structure
Each **use case** gets its own folder and test class.

For example:
Locations/
  GetSelectedLocation/
    WhenGetSelectedLocationQueryIsHandled.cs

- **GetSelectedLocation** – which use case
- **WhenGetSelectedLocationQueryIsHandled** – when this occurs

**Used when the user:**
- opens the dashboard
- needs to know if a location is already selected

Locations/
  ClearSelectedLocation/
    WhenClearSelectedLocationCommandIsExecuted.cs

- **ClearSelectedLocation** – which use case
- **WhenClearSelectedLocationCommandIsExecuted** – when this occurs

**Used when the user:**
- removes their location
- resets the dashboard


## Class names
Each test method describes what we expect to happen.
**Format:** Then_<ExpectedOutcome>

**Examples:**
- Then_Returns_Null_When_User_Has_No_Selected_Location
- Then_Returns_Location_When_User_Has_Selected_Location

---

## Arrange / Act / Assert (AAA)
We follow the Arrange – Act – Assert pattern:

- **Arrange**
  Set up test data and dependencies (often in SetUp)

- **Act**
  Run the command/query being tested

- **Assert**
  Verify the result

---

## Guidelines
- One test class = one scenario
- Tests describe behavior, not implementation
- Naming is more important than brevity
- When a test fails, you should understand why without reading the code