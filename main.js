
resultDetails = {
    "civil": {
        "resultIds" : [
            11078609,
            11079412,
            11080121,
            11080693,
            11081583,
            11081674,
        ],
        "credits" : [
            22.5,
            21.5,
            24,
            24,
            30,
            25,
        ]
    },
    "mech":{
        "resultIds" : [
            11078609,
            11079412,
            11079943,
            11080583,
            11081498,
        ],
        "credits" : [
            22.5,
            21.5,
            23.5,
            23.5,
            30.0,
        ]
    },
    "cse":{
        "resultIds" : [
            11078609,
            11079412,
            11080361,
            11080711,
            11081441,
            11081634,
        ],
        "credits" : [
            21.5,
            22.5,
            24,
            25,
            31,
            25,
        ]
    }
}

const branchNames = {
    "CSE (Computer Science)" : "cse",
    "CE (Civil)" : "civil",
    "ME (Mechanical)" : "mech"
}

function createAndAppendCell(row, content) {
    const cell = row.insertCell();
    cell.innerHTML = content;
    return cell;
  }

function substring(s, start, end){
    try {
        return s.split(start)[1].split(end)[0];
    } catch (error) {
        console.log(error);
        return "Not found"
    }
}

function generateResultURL(rollno, resultId){
    return `https://results.pupexamination.ac.in/t8/results/results.php?rslstid=${resultId}&ROLL=${rollno}&submit=Submit`;
}

function extract_details(content){
    const result_html = substring(content, "<div id=\"mainPrint\" class=\"pbiuc", "<!-- <button onclick=\"document.getElementById('mainPrint')");
    
    var sgpa = substring(result_html, "SGPA</td><td>&nbsp;</td><td>", "<");
    if(parseFloat(sgpa) != NaN){
        sgpa = parseFloat(sgpa);
    }

    const name = substring(result_html, "ਨਾਮ</td>\r\n\t <td>:</td>\r\n\t <td class=\"c3\" width=\"45%\"><span class=\"enf\">","<");
    
    const parents_name_html = substring(result_html, "ਤਾ ਦਾ ਨਾਮ </td>\r\n\t <td>:<br/>:</td>\r\n\t <td class=\"c3\"><span class=\"enf\">", "</span>")
    const parents = parents_name_html.split("<br/>");
    const father_name = parents[0];
    const mother_name = parents[1];
    
    const result = substring(result_html, "ਨਤੀਜਾ : <span class=\"enf\">", "</span>");

    return {
        "name" : name,
        "sgpa" : sgpa,
        "father_name": father_name,
        "mother_name" : mother_name,
        "result" : result
    };
}

async function get_result(resultid, rollno) {
    const baseUrl = generateResultURL(rollno, resultid);
  
    const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(baseUrl)}`;
  
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
      });
  
      if (response.ok) {
        const data = await response.json();
        const html = data.contents;
        const details = extract_details(html);
        return details;
      } else {
        throw new Error('Network Error');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }
const select = document.getElementById('inputBranch');

function addBranchOptions(){

    for(const branchName in branchNames){
        let option = new Option(branchName, branchNames[branchName]);
        select.add(option, undefined);
    }
}

addBranchOptions();

const oldRollNumber = document.getElementById("inputOldRoll");
const branchChange = document.getElementById("branchChange");

branchChange.addEventListener("change", () =>{

    if(branchChange.checked){
        oldRollNumber.disabled = false;
    }
    else{
        oldRollNumber.disabled = true;
    }
});

const mainDiv = document.getElementById("result");
const studentName = document.getElementById("name");
const fatherName = document.getElementById("fname");
const resultTable = document.getElementById("resultTable");
const inputRollno = document.getElementById("inputRoll");


function createTable(semResultIds){

    for(let i=0; i< semResultIds.length; i++){
        let row = resultTable.insertRow(i);
        row.id = semResultIds[i];
        createAndAppendCell(row, i+1);
        createAndAppendCell(row, '-');
        createAndAppendCell(row, '-');
        createAndAppendCell(row, '-');
        createAndAppendCell(row, '-');
    }

}

function updateRow(rowid, semResult, semCredit, rollno){
    const resultRow = document.getElementById(rowid);
    resultRow.cells[1].innerHTML = semResult.sgpa;
    resultRow.cells[2].innerHTML = semResult.cgpa + "/" + semCredit;
    resultRow.cells[3].innerHTML = semResult.result;
    resultRow.cells[4].innerHTML = `<a target="_blank" href="${generateResultURL(rollno, rowid)}">🔗</a>`;
}

function updateNames(result){
    studentName.innerHTML = "Name: " + result.name;
    fatherName.innerHTML = "Father Name: " + result.father_name;
}

function addTotalRow(allResults){
    var totalCredits = 0;
    var scoredCredits = 0;
    var totalSgpa = 0;
    for(let i=0; i<allResults.length; i++){
        totalCredits += allResults[i]["credits"];
        totalSgpa += allResults[i]["sgpa"];
        scoredCredits += allResults[i]["cgpa"];
    }
    console.log("totalSgpa:"+totalSgpa);
    console.log("totalCredits:"+totalCredits);
    console.log("scoredCredits:"+scoredCredits);
    var overallSgpa = (totalSgpa / allResults.length).toFixed(2);
    var overallCgpa = ((scoredCredits/ totalCredits) *10).toFixed(2);

    let row = resultTable.insertRow(allResults.length);
    createAndAppendCell(row, "Total");
    createAndAppendCell(row, overallSgpa);
    createAndAppendCell(row, overallCgpa);
    createAndAppendCell(row, "");
}

async function handleSubmit(event){

    event.preventDefault(); 

    resultTable.innerHTML = "";
    mainDiv.hidden = false;

    var semResultIds = resultDetails[select.value]["resultIds"];
    var semCredits = resultDetails[select.value]["credits"];

    if(branchChange.checked){
        semCredits[0] = resultDetails["civil"]["credits"][0];
        semCredits[1] = resultDetails["civil"]["credits"][1];
    }

    createTable(semResultIds);

    var allSemesterResults = [];
    for(let i =0; i < semResultIds.length; i++){
        var rollno = inputRollno.value;

        if(i<2 && branchChange.checked){
            rollno = oldRollNumber.value;
        }

        var semResult = await get_result(semResultIds[i], rollno);
        semResult["cgpa"] = parseFloat((semResult.sgpa * semCredits[i] / 10).toFixed(2));
        semResult["credits"] = semCredits[i];

        console.log(semResult);

        if(i==0){updateNames(semResult);}

        updateRow(semResultIds[i], semResult, semCredits[i], rollno);

        allSemesterResults.push(semResult);
    }
    console.log(allSemesterResults);
    addTotalRow(allSemesterResults);
}

const form = document.getElementById('myForm');
form.addEventListener('submit', handleSubmit);
