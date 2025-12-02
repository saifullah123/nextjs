import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us - ProductCase',
  description: 'Get in touch with us for any questions or support.',
};

export default function ContactPage() {
  return <ContactClient />;
}
