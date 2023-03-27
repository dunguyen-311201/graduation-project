import {NationProps} from './../types/index';
export const PHONES: NationProps[] = [
  {
    name: 'Viet Nam',
    code: '+84',
    uri: 'https://cdn.pixabay.com/photo/2012/04/10/23/04/vietnam-26834_640.png',
  },
  {
    name: 'Hoa Ky',
    code: '+1',
    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY9vy9cQmM9Ynh6s5Z61fWJGeg1MgZrS6cCFv2oxarWtGSGLuv76qEqjNr2HBXruXMClw&usqp=CAU',
  },
  {
    code: '+86',
    name: 'China',
    uri: 'https://oec.world/images/icons/country/country_chn.png',
  },
  {
    code: '+65',
    name: 'Singapore',
    uri: 'https://icons.iconarchive.com/icons/wikipedia/flags/256/SG-Singapore-Flag-icon.png',
  },
  {
    code: '+856',
    name: 'Lao',
    uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALkAAAB7CAMAAAAfU9HRAAAAclBMVEXOESYAKGj////SECO0FjUAKm0AAFoAJmcAIGUAFmEAA1wAEmAAI2YAGGEAAFUAAFcACF1ZXYaFhqKKkKry8/ajpro9Q3Xc3+ZbZo1ze5oQHmSZnrQADF7o6u+wtsbV199NU4BkZ4xES3u8wc8dNnArQHW3w4LiAAAB6ElEQVR4nO2ai26CQBBFYdru8hQVBER86///YkXTxjRKoblYJ97zAczJZph9zDgOIYQQQgghhBBCCCGEvAxvWnHeteJ8aMVxtULzxzOkubV2wK8PY+7FtRklfuQnI1PH3iAxBjC342oyXRVyoVhNJ/F4gMWHm0dBkK4zuSZbp0EQoQOhzc1uJreY7Qw4EtY8StLlTXGRZZpglx1qHubFHe9zxuchMhjS3JRZi/gp30tkxgDNw3mrd8McuOo4c/O7+Ekdt+ow87DsIC5SwlYdZe7l7Tn+RZajdlSQuU3aqso1RQLaT0HmJu0oLpKCUh1j7m265co5XzaYfMGYB6vO4iKrABITYm6rHuIiFSTTIeZm0ct8Acl0hLm1XQvLhQJyV0KYe9vu/2dDtkX8owhzv3tJvJD6gKgI83rf03xfA6IizM2928Q9lohfFGLeU1zkScx7VvMGREUHmEeH3uYHwJUUYO4de5sfAWXxpddcb57rrS2K67nePVTvuUXvWVHv+VzvnUjxPVTv3V/xe4veNy7F74p633IVv58r7lko7hMp7s0p7oe296Cnz9yDdvX2/V3FsxZuM98S/5hvqVTMt5xROlP0jcY5rkdA88ejeC73v0ea/4zi+XNCCCGEEEIIIYQQQgh5GT4BUGxWXrcgl2oAAAAASUVORK5CYII=',
  },
  {
    code: '+95',
    name: 'Myanmar',
    uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANkAAACQCAMAAACyNz7gAAAAw1BMVEX+ywDqKDk0sjP///8AsDX0ADkGujOOzo0iriD+yAAwsS/zmp/y+fLqIzXqJjf//vkpsCgApwAYrRb4/Pj97O3pGS5tw2yo2ajV7NXd8N3+9fXnAADpCSXxhoz++vv+34f/7sT+0UL/9+H+6Kv+1Vv+67P+1VL+2nH+0DD/9Nb+2nr95p3/zyCj2rDm8+ZDt0N/yX+44LjD5cRevl2a05lRulD5aHv1qKzoABf619r3vL/sS1buYGrvb3fsPErwfIP4x8pYay3MAAAEvUlEQVR4nO2aa1/aMBSHgWyDFlpKJCAQcZu36SblKlRu+/6faiAKtY0uNedQm1+et4DNQ/7JOQnmcgaDwWAwGAwGg8FgMBgMBoPBkD2scyvtIWBRTXsASFjnRNNJs76T73qa/fhJfv5IexAYWOdVUtUzjheEkIu0B4HBJoxEzzheki2XaQ8DHuvqyexKv4VmVZ/MqtqZWddkx7Vuas9h1DCOz2HUL47Wzd7sRi+1fRi1i+Ov273Z7a+0BwOJdVfdm1XvtJq0C3JAq94xFEbN4nhJwmjUO1q/X5n91mehWdVXZhoV6z/kNX+O8tQv+ND7iNk9PcJTcwV8aC9i1qNHeOoRzLxGJWJWaXj4jz2CGR2QKM0jTBq+me2fxsxOfRv9ufhm8TAeJ45HMBvHxAgZ62BWiIdxE0f8x6Kb2b5AjBD8hYZuRotCsyL67ohuVouW6R2tGvaDFcy8kgS0IBQjpEBlPq6w0SiY9cdFCeJlesdA5sPjfjpm4pxB0kvHzLOHyGJDO500bvc9zGnrqe2fansjHeFN23CkVhgUd/1SoYkk1tz87TTNCjZtYCSy16CqTYp6paa2qDFU49RWb1EAehC7NI6fU1SojEsAXSVId+WNIBPZG4EccWD6Rq/2VquRnGEN5uwG1RFDlTbFIhYCrNcvgZS24Uhxrz8Ad4rxbPXS1lRppyJAns/oqKXk1VLsOl4DevIs+SobycAHS+IW2DO15xU/WtoqRQ/2Pgv4tsAuTT6WyNYEojqHAb8H2ZS2k8ReJwOgIhYC4YaHJj5s9/oIN1kYd1een6y0DX2MG2OUWzm7VpRP5EmxhnKrinTfSBuyR5vTBtKdKtZNKp3Ibf+VCdZlMZZZqS+Xx5M+aHkOgTZnst3IIGNzZksX7NYE6VcZJDPZMCLGEcnMkz/RNJF+/kQy8+XbkJ6PMwQcM28kLUYIzIVODBwzmuR4jfTPIThmtSSntArOz58oZt4kgRghE5Q4opglvH0coExa7hsCNNm5ukUxBpH7Cg9/aCcyaz9whFHk8vDwqdigPq2LX5hyhFEgmDmrv8LxB4vZIhC/snLgh4FgxhbCME4ZyzMmnM72ksEPA8OsLErisuNuXnM7S1Eiy5kwc/OCyD3OX5YSnz8K4ph3wccBb+as4iNfu4dJYe5Z/A0ICw3ejMfCGMxZeEpcPo/Nahl+d4Q360QWUnfqRFcRy0c3knoHfBzgZtEw1tc8njSHn0X84eMIbhYJYzDnos0hlsjyDHog0GYuD4+4XZ69NRdsVg6XvUD4BagAbcYWoZgFy3eWz6a0hb6E+gK6pEGbhcN4KGJvvDdc2sB3R2AzN3/oGdfsf7uCw9b7d/+FLtbAZoeeMVjJTAJfvSSyDR1HaLOX/mKalxvoobSdfXKzXRi7y/8m8QWHLbu7OH5qM8fZDXLF5BeNy57Pcw5ssYY14+unIsaTff2MP5W2NezuCGvWCbZFbJZ0l3Nn29IWwPaOoGaO0yWPUntiFL56JF3YOIKa8XJ9/WY79T7ObF2HLdagZqw8/3hjO5vD3hnArjNXZWwJ9lMZgM1S/HQUjJvUz4Exyx7GLHsYs+xhzLKHMcsexix7GLPsYcyyhzHLHsYse+hr9g+Tldc9qXXiZAAAAABJRU5ErkJggg==',
  },
  {
    code: '+66',
    name: 'ThaiLand',
    uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_Thailand.svg/125px-Flag_of_Thailand.svg.png',
  },
  {
    code: '+63',
    name: 'Philippines',
    uri: 'data:image/png;base64,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',
  },
];
