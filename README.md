# Fake Thermostat API

## Usage
`npm run app` will start the server on port 5000

You can provide an optional different port i.e. `npm run app -- 4000`

Thermostat state is just saved in memory, and temperature values are
random.

## Docs

Retrieve Thermostat
```
GET /:thermostat_id

returns
{
  "hvac_mode": "cool" | "heat" | "off",
  "temperature": Int [0-100]
  "setpoint": Int [50-90]
}
```
Returns a thermostat with actual temperature near or on the setpoint
when using a valid UUIDv4 as the ID.  Returns 404 for other IDs


Set Thermostat Controls
```
PATCH /:thermostat_id

Payload
{
  "[hvac_mode]": "cool" | "heat" | "off",
  "[setpoint]": Int [50-90]
}
```
Sets the optional hvac_mode and/or setpoint parameters if valid.
Returns 400 for invalid requests
