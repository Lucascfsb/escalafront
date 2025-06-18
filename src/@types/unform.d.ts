import { UnformField } from '@unform/core'

declare module '@unform/core' {
  export interface RegisterFieldOptions<FieldValue = null> {
    getValue?(ref: HTMLInputElement): FieldValue
    setValue?(ref: HTMLInputElement, value: FieldValue): void
    clearValue?(ref: HTMLInputElement): void
  }
}
