import { isValid, parse } from 'date-fns'

import * as Yup from 'yup'

export const militaresPageSchema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  rank: Yup.string().required('Patente é obrigatória'),
  qualification: Yup.string().required('Qualificação é obrigatória'),
  date_of_entry: Yup.string()
    .required('Data de entrada é obrigatória')
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      'Formato de data inválido. Use AAAA-MM-DD (ex: 1994-04-06).'
    )
    .test('is-valid-date', 'Data inválida ou inexistente', value => {
      if (!value) return false
      const parsedDate = parse(value, 'yyyy-MM-dd', new Date())
      return isValid(parsedDate)
    }),
})
