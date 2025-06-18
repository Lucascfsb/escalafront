export const applyMask = (value: string, mask: string): string => {
  if (!value || !mask) return value

  let maskedValue = ''
  let valIdx = 0
  for (let i = 0; i < mask.length; i++) {
    if (valIdx >= value.length) break

    if (mask[i] === '9') {
      if (/\d/.test(value[valIdx])) {
        maskedValue += value[valIdx]
        valIdx++
      } else {
        // Se o caractere esperado é um dígito mas o valor não tem,
        // pare de aplicar a máscara. Isso evita "27//" se o usuário não digitou MM.
        break
      }
    } else {
      maskedValue += mask[i]
      // Se o caractere do valor já é o caractere da máscara, avança no valor
      if (value[valIdx] === mask[i]) {
        valIdx++
      }
    }
  }
  return maskedValue
}

/**
 * Converte uma data de YYYY-MM-DD (armazenamento) para DD/MM/AAAA (exibição).
 * Ex: "2025-04-27" -> "27/04/2025"
 */
export const formatDateForDisplay = (dateString: string): string => {
  if (!dateString || !dateString.includes('-')) return dateString
  const parts = dateString.split('-') // Espera YYYY-MM-DD
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}` // Converte para DD/MM/AAAA
  }
  return dateString // Retorna original se o formato não for YYYY-MM-DD
}

/**
 * Converte uma data de DD/MM/AAAA (exibição) para YYYY-MM-DD (armazenamento).
 * Ex: "27/04/2025" -> "2025-04-27"
 */
export const formatDateForStorage = (dateString: string): string => {
  if (!dateString || !dateString.includes('/')) return dateString
  const parts = dateString.split('/') // Espera DD/MM/AAAA
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}` // Converte para YYYY-MM-DD
  }
  return dateString // Retorna original se o formato não for DD/MM/AAAA
}
