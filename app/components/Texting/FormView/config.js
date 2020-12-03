import styles from '../Texting.scss';
import InputField from './components/InputField';

export const getConfig = ({ state, onChange }) => {
  const { user_name, phone_number, agreed } = state;
  return [
    {
      name: 'user_name',
      type: 'text',
      label: 'First name (optional)',
      component: InputField,
      value: user_name,
      datafield: 'user_name',
      labelClassName: styles.label,
      inputClassName: styles.input,
      onChange: onChange('user_name'),
    },
    {
      name: 'phone_number',
      type: 'tel',
      component: InputField,
      label: 'Phone number (required)',
      subLabel: '*Standard text and data rates may apply.',
      value: phone_number,
      datafield: 'phone_number',
      labelClassName: styles.label,
      subLabelClassName: styles.dataRates,
      inputClassName: styles.input,
      onChange: onChange('phone_number'),
    },
    {
      name: 'agreed',
      type: 'checkbox',
      component: InputField,
      label: 'I agree to receive text messages from SF Service Guide.',
      value: agreed,
      datafield: 'agree',
      labelClassName: `${styles.checkBox} ${styles.dataRates}`,
      onChange: onChange('agreed'),
    },
  ];
};
