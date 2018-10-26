$(document).ready(function() {
  $('#spin').show();
  const yahooAPI = "http://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in(select woeid from geo.places(1) where text=";
  const userIpAPI = "http://api.ipstack.com/check?access_key=0931abeade0d22e935f16382eea23642&format=1"
  const flagAPI = "http://restcountries.eu/rest/v2/name/"

  fetch(userIpAPI)
    .then(userIpAPI => userIpAPI.json())
    .then(userLocation => fetch(`${yahooAPI}'${userLocation.city}') and u='c'&format=json`))
    .then(forecastJson => forecastJson.json())
    .then(data => displayData(data))
    .catch(err => console.error(err));

  function displayData(data) { //function get forecast and build it into HTML
    const selector = data.query.results.channel;
    const location = selector.location;
    const condition = selector.item.condition;
    const forecast = selector.item.forecast;
    let getFlag = fetch(`${flagAPI}${location.country}`)
      .then(dataFlag => dataFlag.json())
      .then(data => data[0].flag)
      .then(flag => printData(flag))
      .catch(err => console.error(err));

    function printData(flag) {


      let dataHTML =
        `<h1>${location.city}</h1><img src="${flag}" class="flag">
        <em>${location.country}, ${location.region}</em><hr>
        <div><i class="mainicon wi ${code2Icon(condition.code)}"></i><em>${condition.text}</em></div>
        <h1>${condition.temp}&#8451;</h1>`;

      let forecastHTML = `<div class="forecast"><h3 class="top">Forecast</h3>`;
        for (let i = 0; i < forecast.length; i++) {
          forecastHTML +=
            `<div class="row-${[i]}">${forecast[i].day}</div><div class="row-${[i]}"><i class="wi ${code2Icon(forecast[i].code)}"></i></div>
                <div class="row-${[i]}"><em>${forecast[i].text}</em></div>
                <div class="row-${[i]}"><img src="img/arrow-thick-top.svg" class="arrowsSVG">${forecast[i].high}</div>
                <div class="row-${[i]}"><img src="img/arrow-thick-bottom.svg" class="arrowsSVG">${forecast[i].low}</div>
            `;
        }
      forecastHTML += `<div class="bottom"><small>Last update:${selector.lastBuildDate}</small></div></div>`;

      $('#cities').html(dataHTML);
      $('#forecast').html(forecastHTML);
      $('#spin').hide();
      $('body').scrollTop();
    }
  } //end displayData()

  function createErrorMessage(txt) { //creates message error
    $(".alert").text(txt).slideDown('slow').delay(2900).slideUp('slow');
  };

  $('form').submit(function(evt) { //submit button
    evt.preventDefault();
    if ($('#search').val() == '') {
      createErrorMessage('Enter the City Name, please!')
    } else {
      fetch(`${yahooAPI}"${$("#search").val()}")and u="c"&format=json`)
        .then(getJson => getJson.json())
        .then(function(data) {
          console.log(data);
          if (data.query.results == null) {
            createErrorMessage($('#search').val() + ' is not a valid city')
            $("#search").val('')
          } else {
            displayData(data)
          }
        });
    } //end else
  }); // end submit

});
