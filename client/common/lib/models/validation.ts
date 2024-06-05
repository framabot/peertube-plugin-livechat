// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

export enum ValidationErrorType {
  WrongType,
  WrongFormat,
  NotInRange,
}

export class ValidationError extends Error {
  properties: {[key: string]: ValidationErrorType[] } = {}

  constructor (name: string, message: string | undefined, properties: ValidationError['properties']) {
    super(message)
    this.name = name
    this.properties = properties
  }
}
