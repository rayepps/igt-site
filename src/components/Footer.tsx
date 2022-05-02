import Link from 'next/link'
import formatDate from 'date-fns/format'
import { BsFacebook, BsInstagram } from 'react-icons/bs'

export default function Footer() {
  return (
    <div className="bg-black flex flex-row justify-center py-12">
      <div className="max-w-7xl w-full flex flex-row items-start justify-between">
        <div>
          <a href="/about" className="text-white text-lg py-2 block">
            About Us
          </a>
          <a href="/contact" className="text-white text-lg py-2 block">
            Contact Us
          </a>
          <a href="/faq" className="text-white text-lg py-2 block">
            FAQs
          </a>
        </div>
        <div>
          <a href="/privacy" className="text-white text-lg py-2 block">
            Privacy Policy
          </a>
          <a href="/terms" className="text-white text-lg py-2 block">
            Terms of Use
          </a>
        </div>
        <div>
          <a className="text-white text-lg py-2 block" href="https://idahoguntrader.store">
            Gun Trader Gear
          </a>
          <a href="/become-a-sponsor" className="text-white text-lg py-2 block">
            Sponsorship Opportunities
          </a>
        </div>
        <div>
          <div className="flex flex-row items-center justify-end mb-4">
            <a href="https://www.facebook.com/idahoguntrader">
              <BsFacebook size={40} className="text-white text-lg mr-4" />
            </a>
            <a href="https://www.instagram.com/idahoguntrader">
              <BsInstagram size={40} className="text-white text-lg" />
            </a>
          </div>
          <div className="text-white text-lg">
            Copyright &copy; {formatDate(new Date(), 'yyyy')} <i className="text-red-600">Idaho Gun Trader</i> All
            Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  )
}
