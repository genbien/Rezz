const express = require('express');
const request = require('request');
const { t, q } = require('./utils.js');

const METRO_13_STATION_MONTPARNASSE = 152;
const METRO_13_DIRECTION_CHATILLON = 33;
const METRO_13_DIRECTION_ASNIERES = 32;

const BUS_LINE_38_STATION_VAL_DE_GRACE = 2766;
const BUS_LINE_38_DIRECTION_PORTE_ORLEAN = 70;
const BUS_LINE_38_DIRECTION_GARE_DU_NORT = 183;

const RER_LINE_B_STATION_PORT_ROYAL = 62;
const RER_LINE_B_DIRECTION_ROBINSON = 3;
const RER_LINE_B_DIRECTION_CDG = 4;

function get_ratp_infos(type, line, station, dest) {
  const url = `https://api-ratp.pierre-grimaud.fr/v2/${type}/${line}/stations/${station}?destination=${dest}`;
  return t(request, url)
    .then(function(response) {
      const info = JSON.parse(response.body);
      const data = info.response;

      const typename = {'metros':'Métro','rers':'RER','bus':'Bus'}[type];
      const name = data.informations.station.name;
      const dest = (type == 'rer') ?
        data.informations.destination.name :
        data.schedules[0].destination;
      const times = [
        data.schedules[0].message,
        data.schedules[1].message
      ];
      return { type: typename, line, name, dest, times };
    })
}

const app = express();

app.get('/', function(req, res) {
  Promise.all([
    get_ratp_infos('metros', '13', METRO_13_STATION_MONTPARNASSE, METRO_13_DIRECTION_CHATILLON),
    get_ratp_infos('metros', '13', METRO_13_STATION_MONTPARNASSE, METRO_13_DIRECTION_ASNIERES),
    get_ratp_infos('bus', '38', BUS_LINE_38_STATION_VAL_DE_GRACE, BUS_LINE_38_DIRECTION_PORTE_ORLEAN),
    get_ratp_infos('bus', '38', BUS_LINE_38_STATION_VAL_DE_GRACE, BUS_LINE_38_DIRECTION_GARE_DU_NORT),
    get_ratp_infos('rers', 'B', RER_LINE_B_STATION_PORT_ROYAL, RER_LINE_B_DIRECTION_ROBINSON),
    get_ratp_infos('rers', 'B', RER_LINE_B_STATION_PORT_ROYAL, RER_LINE_B_DIRECTION_CDG),
  ])
    .then(function(schedules) {
      console.log(schedules);
      res.render('app/ratp', { schedules })
    })
    .catch(function(err) {
      res.render('app/ratp', { err })
    });
})

module.exports = app;

