'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Locale = 'th' | 'en'

interface LanguageContextType {
    locale: Locale
    setLocale: (locale: Locale) => void
    t: (key: string) => string
}

const dictionary: Record<Locale, Record<string, string>> = {
    th: {
        'nav.home': 'หน้าแรก',
        'nav.about': 'เกี่ยวกับ',
        'nav.portfolio': 'ผลงาน',
        'nav.contact': 'ติดต่อ',
        'hero.available': 'พร้อมรับงานโปรเจกต์',
        'hero.scroll': 'เลื่อนลง',
        'about.title': 'ประวัติย่อ',
        'about.label': 'About Me',
        'portfolio.title': 'ผลงานที่โดดเด่น',
        'portfolio.description': 'ผลงานที่พิสูจน์การทำงานแบบ End-to-End ตั้งแต่การออกแบบโครงสร้างไปจนถึงการพัฒนา AI Solution',
        'portfolio.view_details': 'คลิกเข้าชมผลงาน',
        'tech.title': 'อาวุธที่ใช้สร้างสรรค์',
        'footer.rights': 'สงวนลิขสิทธิ์',
        'footer.built_with': 'สร้างด้วย ❤️ และเทคโนโลยีที่ทันสมัย',
        'admin.title': 'ระบบหลังบ้าน',
        'admin.view_site': 'ดูหน้าเว็บ',
        'admin.logout': 'ออกจากระบบ',
        'admin.tab.profile': 'โปรไฟล์',
        'admin.tab.projects': 'ผลงาน',
        'admin.tab.techstack': 'เทคโนโลยี',
        'admin.tab.security': 'ความปลอดภัย',
        'admin.tab.activity': 'ประวัติกิจกรรม',
        'admin.desc.profile': 'จัดการข้อมูลส่วนตัว',
        'admin.desc.projects': 'จัดการรายการผลงาน',
        'admin.desc.techstack': 'จัดการทักษะและเครื่องมือ',
        'admin.desc.security': 'ตั้งค่าการเข้าถึง',
        'admin.desc.activity': 'บันทึกการเปลี่ยนแปลง',
        'admin.profile.title': 'แก้ไขข้อมูลส่วนตัว',
        'admin.projects.title': 'จัดการ Projects',
        'admin.tech.title': 'จัดการ Tech Stack',
        'admin.save': 'บันทึกการเปลี่ยนแปลง',
        'admin.save_all': 'บันทึกทั้งหมด',
        'admin.add_project': '+ เพิ่ม Project',
        'admin.add_category': '+ เพิ่ม Category',
        'admin.loading': 'กำลังบันทึก...',
        'admin.success': 'บันทึกสำเร็จ!',
        'admin.error': 'เกิดข้อผิดพลาด',
        'admin.lang.thai': 'ภาษาไทย',
        'admin.lang.english': 'ภาษาอังกฤษ',
        'admin.content.thai': 'เนื้อหาภาษาไทย',
        'admin.content.english': 'เนื้อหาภาษาอังกฤษ'
    },
    en: {
        'nav.home': 'Home',
        'nav.about': 'About',
        'nav.portfolio': 'Portfolio',
        'nav.contact': 'Contact',
        'hero.available': 'Available for Global Projects',
        'hero.scroll': 'Scroll Down',
        'about.title': 'Short Bio',
        'about.label': 'About Me',
        'portfolio.title': 'Featured Works',
        'portfolio.description': 'Works proving End-to-End expertise from infrastructure design to AI Solution development.',
        'portfolio.view_details': 'Click to Visit',
        'tech.title': 'Creative Tech Stack',
        'footer.rights': 'All Rights Reserved',
        'footer.built_with': 'Built with ❤️ and modern technologies',
        'admin.title': 'Admin Dashboard',
        'admin.view_site': 'View Site',
        'admin.logout': 'Logout',
        'admin.tab.profile': 'Profile',
        'admin.tab.projects': 'Projects',
        'admin.tab.techstack': 'Tech Stack',
        'admin.tab.security': 'Security',
        'admin.tab.activity': 'Activity Log',
        'admin.desc.profile': 'Manage your personal info',
        'admin.desc.projects': 'Manage your portfolio works',
        'admin.desc.techstack': 'Manage your tools and skills',
        'admin.desc.security': 'Configure access settings',
        'admin.desc.activity': 'Audit log and change history',
        'admin.profile.title': 'Edit Profile',
        'admin.projects.title': 'Manage Projects',
        'admin.tech.title': 'Manage Tech Stack',
        'admin.save': 'Save Changes',
        'admin.save_all': 'Save All Changes',
        'admin.add_project': '+ Add Project',
        'admin.add_category': '+ Add Category',
        'admin.loading': 'Saving...',
        'admin.success': 'Saved Successfully!',
        'admin.error': 'Error Occurred',
        'admin.lang.thai': 'Thai Language',
        'admin.lang.english': 'English Language',
        'admin.content.thai': 'Thai Content',
        'admin.content.english': 'English Content'
    }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('th')

    useEffect(() => {
        const savedLocale = localStorage.getItem('portfolio_locale') as Locale
        if (savedLocale && (savedLocale === 'th' || savedLocale === 'en')) {
            setLocaleState(savedLocale)
        }
    }, [])

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale)
        localStorage.setItem('portfolio_locale', newLocale)
    }

    const t = (key: string) => {
        return dictionary[locale][key] || key
    }

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
