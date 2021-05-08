$(document).ready(function(){
    getRate();
    
    var date_out;

    getHistoryRate(); 
    $('input[type="date"]').on('input',getHistoryRate);
    
});
//{"currency":"USD","country":"United States Dollar"}
let array = [];
let Valute = [];
let USD_Price,EUR_Price;

function getRate(){
    //https://api.coindesk.com/v1/bpi/currentprice.json
    $.get(
        "https://api.coindesk.com/v1/bpi/currentprice.json",
        
        function(data){
            data = JSON.parse(data);
            array = Object.entries(data);

            time_array = Object.entries(array[0][1]);
            current_YM = time_array[2][1];
            current_TM = time_array[2][1];
            //
            current_YM = current_YM.substring(12,0);
            current_TM = current_TM.substring(25,15);
         
            document.getElementById("YM").innerHTML = current_YM;
            document.getElementById("TM").innerHTML = current_TM;
            
            Valute = Object.entries(array[3][1]);
            //USD
            //OBJ[0][1] - obj{rate,code...}[1][1] - {rate: price}
            // USD_Price = Object.entries(Valute[0][1])[2][1];
            USD_Price = Valute[0][1]["rate"];
            console.log(USD_Price);
    
            
            //EUR
            EUR_Price = Valute[2][1]["rate"];
            console.log(EUR_Price);
            
            document.getElementById("usd_price").innerHTML = USD_Price + "$";
            document.getElementById("usd_eur").innerHTML = EUR_Price + "€";

            //Draw
            var ctx = document.getElementById('myChart2').getContext('2d');
            let output = "currency";
            Chart.defaults.global.defaultFontColor = 'white';
            Chart.defaults.global.defaultFontSize = 16;
            console.log(parseFloat(USD_Price.replace(",",".")));

            var myBarChart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: [`USD ${output}`,`EUR ${output}`],
                    datasets: [{
                        label: "Bitcoin Online",
                        backgroundColor: 'rgb(65,99,132)',
                        data: [parseFloat(USD_Price.replace(",",".")),parseFloat(EUR_Price.replace(",","."))]
                    }]
                },
                options: {
                    legend: {
                        labels: {
                            // This more specific font property overrides the global property
                            fontColor: 'white',
                            defaultFontSize: 20
                        }
                    }
                }
            });   
        }
        );
    }
function ret(data = []){
    for(let i = 0; i < 2; i++){
        return data[i];
    }
} 
  
/* function ret(data){
    k = data;
    return k;
} */
  
function getHistoryRate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    console.log(dd);
    date_out = document.getElementById("date2").value.substring(8,15);
    console.log(date_out);
    dd = parseInt(dd);
    
    if(date_out == ""){
        console.log("null");
    }else{
        //check if user select day from future
        if(dd < date_out){
            /* console.log(dd + " is not equal " + date_out); */
            alert("History could not be showed. You`ve selected: " + date_out + " day from future. " + "Today only: " + dd + " day in this month.");

        }else{
            $.get(
                "https://api.coindesk.com/v1/bpi/historical/close.json",
                {
                    "start": $('#date1').val() ,
                    "end":  $('#date2').val() ,
                    "currency" : "USD"
                },
                function(data){
                    data = JSON.parse(data);
                    console.log(data);
                    array = Object.entries(data);
                    console.log(array);
                    let each_day = array[0][1];
                    console.log("end in 13"+each_day);
                    each_day = Object.entries(each_day); //date and rate
                    let Sep_Hist = Object.entries(each_day); 
                    let USD_History = [];
                    let Day_Queue = [];
        
                    for(let i = 0; i < each_day.length; i++){
                        Day_Queue[i] = Object.entries(Sep_Hist)[i][1][1][0];
                        USD_History[i] = parseInt(Object.entries(Sep_Hist)[i][1][1][1]);
                        console.log(USD_History[i]);
                    } 
                    /* Get tbody and append it */
                    let apn_table = document.getElementById("append"); 
                    let apn_tbody = document.createElement("tbody");
                    //loop and append
                    for(let k = 0; k < each_day.length;k++){
                        let tr = document.createElement("tr");
                        let td_price = document.createElement("td");
                        let td_date = document.createElement("td");
                        
                        td_price.className = "td_price";
                        td_price.className = "td_date";
                        /* Loop & Append */
    
                        td_date.innerHTML = Day_Queue[k];
                        td_price.innerHTML = USD_History[k]+"$";
                        tr.appendChild(td_date);
                        tr.appendChild(td_price);
                        
                        apn_tbody.appendChild(tr);
                        
                    } 
                    if(dd < date_out){
                        apn_table.removeChild(apn_tbody);
                        console.log(apn_table);

                    }else{
                        apn_table.appendChild(apn_tbody);
                        console.log(apn_table);
                    }
                    
                    /* apn_tbody.appendChild(tr); */






                    Chart.defaults.global.defaultFontColor = '#0d1b21';
                    console.log(ret(USD_History)); 
                    //Draw
                    var ctx = document.getElementById('myChart').getContext('2d');
                    let output = "currency";
                    var myBarChart = new Chart(ctx, {
                        type: "line",
                        data: {
                            labels: Day_Queue,
                            datasets: [{
                                label: "USD History",
                                backgroundColor: '#0d1b21',
                                data: USD_History 
                            }]
                            
                        },
                        options: {
                            legend: {
                                labels: {
                                    // This more specific font property overrides the global property
                                    fontColor: '#0d1b21',
                                    defaultFontSize: 20
                                }
                            }
                        }
                    }); 
                }
                );
        }
    }
    }

