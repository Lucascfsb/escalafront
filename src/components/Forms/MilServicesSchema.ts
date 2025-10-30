import * as Yup from 'yup'

export const serviceTypeSchema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  description: Yup.string().default(''),
  rank: Yup.object()
    .shape({
      value: Yup.string().required('Selecione um Posto/Graduação'),
      label: Yup.string().required(),
    })
    .nullable()
    .required('Selecione um Posto/Graduação'),
})

export const searchServiceSchema = Yup.object().shape({
  searchName: Yup.string().default(''),
})