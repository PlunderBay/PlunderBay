import { ShipState } from "shared/models/shipState";

export function getSloop(): ShipState {
    return  {
        lastProcessedInput: 0,
        x: 0,
        z: 0,
        currentRotation: 0,
        currentSpeed: 0.1,
        currentTurnDirectionKey: "center",
      
        possibleTurnDirections: {
          left: -1,
          center: 0,
          right: 1
        },
        
        minSpeed: 0,
        maxSpeed: 0.1,
        turnSpeed: 0.01
      };
}