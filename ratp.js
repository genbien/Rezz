const express = require('express');
const request = require('request');
const { t, q } = require('./utils.js');

const moment = require('moment');

const METRO_13_STATION_MONTPARNASSE = 152;
const METRO_13_DIRECTION_CHATILLON = 33;
const METRO_13_DIRECTION_ASNIERES = 32;

const METRO_4_STATION_VAVIN = 144;
const METRO_4_DIRECTION_MAIRIE_MONTROUGE = 13;
const METRO_4_DIRECTION_PORTE_CLIGNANCOURT = 14;

const METRO_6_STATION_RASPAIL = 145;
const METRO_6_DIRECTION_NATION = 8;
const METRO_6_DIRECTION_CDG_ETOILE = 17;

const METRO_12_STATION_NOTRE_DAME_CHAMPS = 218;
const METRO_12_DIRECTION_FRONT_POPULAIRE = 30;
const METRO_12_DIRECTION_MAIRIE_ISSY = 31;

const BUS_LINE_38_STATION_VAL_DE_GRACE = 2766;
const BUS_LINE_38_DIRECTION_PORTE_ORLEAN = 70;
const BUS_LINE_38_DIRECTION_GARE_DU_NORT = 183;

const BUS_LINE_27_STATION_LUXEMBOURG = 2369;
const BUS_LINE_27_DIRECTION_ST_LAZARE = 160;
const BUS_LINE_27_DIRECTION_PORTE_IVRY = 169;

const BUS_LINE_21_STATION_LUXEMBOURG = 2369;
const BUS_LINE_21_DIRECTION_ST_LAZARE = 160;
const BUS_LINE_21_DIRECTION_PORTE_GENTILLY = 162;

const BUS_LINE_83_STATION_PORT_ROYAL = 4002;
const BUS_LINE_83_DIRECTION_PORTE_IVRY = 169;
const BUS_LINE_83_DIRECTION_FRIEDLAND_HAUSSMAN = 248;

const BUS_LINE_91_STATION_PORT_ROYAL = 4002;
const BUS_LINE_91_DIRECTION_MONTPARNASSE = 261;
const BUS_LINE_91_DIRECTION_BASTILLE = 262;

const RER_LINE_B_STATION_PORT_ROYAL = 62;
const RER_LINE_B_DIRECTION_ROBINSON = 3;
const RER_LINE_B_DIRECTION_CDG = 4;

function get_ratp_infos(type, line, station, dest) {
  const url = `https://api-ratp.pierre-grimaud.fr/v2/${type}/${line}/stations/${station}?destination=${dest}`;
  return t(request, url)
    .then(function(response) {
      const info = JSON.parse(response.body);
      const data = info.response;

      const typename = {'metros':'metro','rers':'rer','bus':'bus'}[type];
      const name = data.informations.station.name;
      const dest = (type == 'rer') ?
        data.informations.destination.name :
        data.schedules[0].destination;
      const times = data.schedules.map(function (s) {
        if (s.message.match(/([0-9]{1,2}:[0-9]{1,2})/)) {
          const info = moment(RegExp.$1, "HH:mm");
          const diff = info.diff(moment());
          return ''+parseInt(moment.duration(diff).asMinutes());
        }
        else if (s.message.match(/([0-9]{1,2}) mn/)) {
          return RegExp.$1;
        }
        else {
          return '--'
        }
      }).slice(0, 2);
      return { type: typename, line, name, dest, times };
    })
}

function get_my_ratp_infos() {
  return  Promise.all([
    get_ratp_infos('metros', '13', METRO_13_STATION_MONTPARNASSE, METRO_13_DIRECTION_CHATILLON),
    get_ratp_infos('metros', '13', METRO_13_STATION_MONTPARNASSE, METRO_13_DIRECTION_ASNIERES),
    get_ratp_infos('metros', '4', METRO_4_STATION_VAVIN, METRO_4_DIRECTION_MAIRIE_MONTROUGE),
    get_ratp_infos('metros', '4', METRO_4_STATION_VAVIN, METRO_4_DIRECTION_PORTE_CLIGNANCOURT),
    get_ratp_infos('metros', '6', METRO_6_STATION_RASPAIL, METRO_6_DIRECTION_NATION),
    get_ratp_infos('metros', '6', METRO_6_STATION_RASPAIL, METRO_6_DIRECTION_CDG_ETOILE),
    get_ratp_infos('metros', '12', METRO_12_STATION_NOTRE_DAME_CHAMPS, METRO_12_DIRECTION_FRONT_POPULAIRE),
    get_ratp_infos('metros', '12', METRO_12_STATION_NOTRE_DAME_CHAMPS, METRO_12_DIRECTION_MAIRIE_ISSY),
    get_ratp_infos('bus', '38', BUS_LINE_38_STATION_VAL_DE_GRACE, BUS_LINE_38_DIRECTION_PORTE_ORLEAN),
    get_ratp_infos('bus', '38', BUS_LINE_38_STATION_VAL_DE_GRACE, BUS_LINE_38_DIRECTION_GARE_DU_NORT),
    get_ratp_infos('bus', '27', BUS_LINE_27_STATION_LUXEMBOURG, BUS_LINE_27_DIRECTION_ST_LAZARE),
    get_ratp_infos('bus', '27', BUS_LINE_27_STATION_LUXEMBOURG, BUS_LINE_27_DIRECTION_PORTE_IVRY),
    get_ratp_infos('bus', '21', BUS_LINE_21_STATION_LUXEMBOURG, BUS_LINE_21_DIRECTION_ST_LAZARE),
    get_ratp_infos('bus', '21', BUS_LINE_21_STATION_LUXEMBOURG, BUS_LINE_21_DIRECTION_PORTE_GENTILLY),
    get_ratp_infos('bus', '83', BUS_LINE_83_STATION_PORT_ROYAL, BUS_LINE_83_DIRECTION_PORTE_IVRY),
    get_ratp_infos('bus', '83', BUS_LINE_83_STATION_PORT_ROYAL, BUS_LINE_83_DIRECTION_FRIEDLAND_HAUSSMAN),
    get_ratp_infos('bus', '91', BUS_LINE_91_STATION_PORT_ROYAL, BUS_LINE_91_DIRECTION_MONTPARNASSE),
    get_ratp_infos('bus', '91', BUS_LINE_91_STATION_PORT_ROYAL, BUS_LINE_91_DIRECTION_BASTILLE),
    get_ratp_infos('rers', 'B', RER_LINE_B_STATION_PORT_ROYAL, RER_LINE_B_DIRECTION_ROBINSON),
    get_ratp_infos('rers', 'B', RER_LINE_B_STATION_PORT_ROYAL, RER_LINE_B_DIRECTION_CDG),
  ]).then(function(results) {
    results.forEach(function (result, idx) {
      result.first = (idx % 2 == 0);
    });
    return results;
  });
}

const app = express();

app.get('/app/ratp', function(req, res) {
  get_my_ratp_infos()
    .then(function(schedules) {
      console.log(schedules);
      res.render('app/ratp', { schedules })
    })
    .catch(function(err) {
      console.log(err);
      res.render('app/ratp', { err })
    });
})

module.exports = { app, get_my_ratp_infos };

