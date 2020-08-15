import { isUuid } from 'uuidv4';
import { getRandomInt } from './util';

const MIN_SETPOINT = 50;
const MAX_SETPOINT = 90;
const MIN_TEMP = 0;
const MAX_TEMP = 100;
const STARTING_HEAT_SETPOINT = 68;
const STARTING_COOL_SETPOINT = 76;
const VALID_MODES = ['cool', 'heat', 'off'];

export interface IThermostat {
  id: string;
  hvac_mode: string;
  temperature: number;
  setpoint: number;
}

export interface IThermostatControls {
  hvac_mode?: string;
  setpoint?: number;
}

export class Thermostat implements IThermostat {
  public id: string;
  public hvac_mode: string;
  public temperature: number;
  public setpoint: number;

  constructor(id: string) {
    if (!isUuid(id)) {
      throw new Error(`Invalid ID ${id} for thermostat`);
    }

    this.id = id;
    this.hvac_mode = Thermostat.GenerateInitialMode();
    this.setpoint = this.hvac_mode == 'heat' ? STARTING_HEAT_SETPOINT : STARTING_COOL_SETPOINT;
    this.step();
  }

  serialize(): IThermostat {
    return {
      id: this.id,
      hvac_mode: this.hvac_mode,
      temperature: this.temperature,
      setpoint: this.setpoint,
    };
  }

  update(controls: IThermostatControls): void {
    Thermostat.ValidateControls(controls);

    if (controls.hvac_mode !== undefined) {
      this.hvac_mode = controls.hvac_mode;
    }

    if (controls.setpoint !== undefined) {
      this.setpoint = controls.setpoint;
    }
  }

  step() {
    let nextTemperature: number
    if (this.hvac_mode == 'off') {
      nextTemperature = this.temperature - getRandomInt(-2, 2);
    } else {
      nextTemperature = getRandomInt(this.setpoint - 2, this.setpoint + 2);
    }

    this.temperature = nextTemperature < MIN_TEMP
      ? MIN_TEMP
      : nextTemperature > MAX_TEMP
        ? MAX_TEMP
        : nextTemperature;
  }

  static GenerateInitialMode(): string {
    return VALID_MODES[Math.floor(Math.random() * VALID_MODES.length)];
  }

  static ValidateControls(controls: IThermostatControls): void {
    if (controls.hvac_mode !== undefined) {
      if (VALID_MODES.indexOf(controls.hvac_mode) < 0) {
        throw new Error(`Invalid Mode: ${controls.hvac_mode} for thermostat`);
      }
    }

    if (controls.setpoint !== undefined) {
      if (controls.setpoint < MIN_SETPOINT) {
        throw new Error(`Invalid Setpoint: ${controls.setpoint} is lower than MIN ${MIN_SETPOINT}`);
      }

      if (controls.setpoint > MAX_SETPOINT) {
        throw new Error(`Invalid Setpoint: ${controls.setpoint} is higher than MAX ${MAX_SETPOINT}`);
      }
    }
  }
}
