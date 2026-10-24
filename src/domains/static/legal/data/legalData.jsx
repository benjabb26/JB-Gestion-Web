import { TerminosYCondiciones } from '../../../../modules/legal/TerminosYCondiciones'
import { PoliticasYPrivacidad } from '../../../../modules/legal/PoliticasYPrivacidad'

export const legalData = {
  terminos: {
    title: 'Términos y Condiciones',
    content: <TerminosYCondiciones />,
  },
  privacidad: {
    title: 'Política de Privacidad',
    content: <PoliticasYPrivacidad />,
  },
}
