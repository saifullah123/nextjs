import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us - Net Gate Western Boutique',
  description: 'Have questions about our Western show shirts or horse tack? Contact Net Gate Western Boutique for expert assistance and custom inquiries.',
};

export default function ContactPage() {
  return <ContactClient />;
}
