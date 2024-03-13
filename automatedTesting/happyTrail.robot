*** Settings ***
Documentation                           Happy Trail Test of My Calendar Application

Library                                 Selenium2Library        screenshot_root_directory=./Screenshots

*** Variables ***
${HOMEPAGE}                             https://3.97.29.171/
${BROWSER}                              Chrome

*** Keywords ***
Navigate to Homepage
    Open Browser                        ${HOMEPAGE}             ${BROWSER}
    Maximize Browser Window

Carefully Click Element     
    [Arguments]                         ${Element}
    Wait Until Page Contains Element    ${Element}
    Click Element                       ${Element}

Carefully Input Text
    [Arguments]                         ${Element}              ${Text}
    Wait Until Element Is Visible       ${Element}
    Input Text                          ${Element}              ${Text}

*** Test Cases ***

TEST_01: Manual 5 Courses - Fall
    # Going to site page
    Navigate to Homepage
    
    Sleep                               2s

    # Checking Static Item (Two Titles, Two navigation menue items, Title and Grpyh image)
    Wait Until Element Is Visible       //h1[text()="Welcome To Our Calendar!"]
    Wait Until Element Is Visible       //p[text()="Group 202"]
    Wait Until Element Is Visible       //h3[text()="My Calendar App"]
    Wait Until Element Is Visible       //img[@class="gryphPic"]
    Wait Until Element Is Visible       //a[text()="Home"]
    Wait Until Element Is Visible       //a[text()="About"]

    # Choosing Term
    Carefully Click Element             //select[@name="terms"]
    Carefully Click Element             //option[@value="fall22"]
    Carefully Click Element             //input[@class="semSubmitButton"]

    # Choosing Autofill options
    Carefully Click Element             (//input[@class="semSubmitButton"])[2]

    # Inputting Courses
    Carefully Input Text                //input[@id="courseOne"]            MUSC*1160*0101
    Carefully Click Element             //strong[text()="MUSC*1160*0101"]

    Carefully Input Text                //input[@id="courseTwo"]            AGR*2150*01
    Carefully Click Element             //strong[text()="AGR*2150*01"]

    Carefully Input Text                //input[@id="courseThree"]          MICR*3420*01
    Carefully Click Element             //strong[text()="MICR*3420*01"]

    Carefully Input Text                //input[@id="courseFour"]           FOOD*6300*01
    Carefully Click Element             //strong[text()="FOOD*6300*01"]

    Carefully Input Text                //input[@id="courseFive"]           CIS*1200*DE01
    Carefully Click Element             //strong[text()="CIS*1200*DE01"]

    # Submitting Courses
    Carefully Click Element             //input[@class="submitButton"]

    # Checking Courses Appeared
    Wait Until Page Contains Element    //td[text()="CIS*1200*DE01 (7161) Introduction to Computing"]
    Wait Until Page Contains Element    //td[text()="FOOD*6300*01 (7876) Food Science Communication"]
    Wait Until Page Contains Element    //td[text()="MUSC*1160*0101 (8739) Theory and Musicianship I"]
    Wait Until Page Contains Element    //td[text()="AGR*2150*01 (6605) Plant Ag. for Int'l Devmt"]
    Wait Until Page Contains Element    //td[text()="MICR*3420*01 (8735) Microbial Diversity & Ecology"]

    Sleep                               3s


TEST_02: No Tuesday,Thursday - No Courses - Winter
    # Choosing Term
    Carefully Click Element             //select[@name="terms"]
    Carefully Click Element             //option[@value="winter23"]
    Carefully Click Element             //input[@class="semSubmitButton"]

    # Choosing Autofill options
    Carefully Click Element             //input[@id="daysOff"]
    Carefully Click Element             (//input[@class="semSubmitButton"])[2]

    # Submitting Courses
    Carefully Click Element             //input[@class="submitButton"]

    # Checking Schedule Was Filled In
    Wait Until Page Does Not Contain    (//td[text()="-"])[196]

    Sleep                               3s


TEST_03: No Morning - No Courses - Winter
    # Choosing Term
    Carefully Click Element             //select[@name="terms"]
    Carefully Click Element             //option[@value="winter23"]
    Carefully Click Element             //input[@class="semSubmitButton"]

    # Choosing Autofill options
    Carefully Click Element             //input[@id="morningOff"]
    Carefully Click Element             (//input[@class="semSubmitButton"])[2]

    # Submitting Courses
    Carefully Click Element             //input[@class="submitButton"]

    # Checking Schedule Was Filled In
    Wait Until Page Does Not Contain    (//td[text()="-"])[196]

    Sleep                               3s


TEST_04: Course Level 4000 - No Courses - Winter
    # Choosing Term
    Carefully Click Element             //select[@name="terms"]
    Carefully Click Element             //option[@value="winter23"]
    Carefully Click Element             //input[@class="semSubmitButton"]

    # Choosing Autofill options
    Carefully Click Element             //input[@id="courseLevel"]
    Carefully Click Element             //input[@id="fourthYear"]
    Carefully Click Element             //input[@id="fourthYear"]
    Carefully Click Element             (//input[@class="semSubmitButton"])[2]

    # Submitting Courses
    Carefully Click Element             //input[@class="submitButton"]

    # Checking Schedule Was Filled In
    Wait Until Page Does Not Contain    (//td[text()="-"])[196]

    Sleep                               3s


TEST_05: No Tuesday,Thursday + Course Level 2000 - Two Courses - Fall
    # Choosing Term
    Carefully Click Element             //select[@name="terms"]
    Carefully Click Element             //option[@value="fall22"]
    Carefully Click Element             //input[@class="semSubmitButton"]

    # Choosing Autofill options
    Carefully Click Element             //input[@id="daysOff"]
    Carefully Click Element             //input[@id="courseLevel"]
    Carefully Click Element             //input[@id="secondYear"]
    Carefully Click Element             //input[@id="secondYear"]
    Carefully Click Element             (//input[@class="semSubmitButton"])[2]

    # Inputting Courses
    Carefully Input Text                //input[@id="courseOne"]            NUTR*1010*DE01
    Carefully Click Element             //strong[text()="NUTR*1010*DE01"]

    Carefully Input Text                //input[@id="courseTwo"]            SPAN*1100*DE01
    Carefully Click Element             //strong[text()="SPAN*1100*DE01"]

    # Submitting Courses
    Carefully Click Element             //input[@class="submitButton"]

    # Checking Schedule Was Filled In
    Wait Until Page Does Not Contain    (//td[text()="-"])[196]

    Sleep                               3s