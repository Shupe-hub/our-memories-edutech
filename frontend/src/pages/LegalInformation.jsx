import { Link, useLocation } from "react-router-dom";
import "./LegalInformation.css";

const legalPages = {
    "/privacy": {
        title: "Privacy Policy",
        description:
            "Our privacy information is being prepared for publication. Please contact us if you need information about how personal information is handled.",
    },
    "/terms": {
        title: "Terms & Conditions",
        description:
            "Our full terms and conditions are being prepared for publication. Please contact us to request the current terms relevant to a service.",
    },
    "/refund": {
        title: "Refund Policy",
        description:
            "Our full refund policy is being prepared for publication. Please contact us with questions about the terms applicable to a service before proceeding.",
    },
};

function LegalInformation() {
    const { pathname } = useLocation();
    const page = legalPages[pathname];

    if (!page) {
        return (
            <main className="legal-information-page">
                <section className="legal-information-card">
                    <span className="legal-information-label">OUR MEMORIES EDUTECH</span>
                    <h1>Information page not found</h1>
                    <p>The requested legal information page could not be found.</p>
                    <Link to="/">Return to home</Link>
                </section>
            </main>
        );
    }

    return (
        <main className="legal-information-page">
            <section className="legal-information-card">
                <span className="legal-information-label">OUR MEMORIES EDUTECH · LEARN. APPLY. GROW.</span>
                <h1>{page.title}</h1>
                <p>{page.description}</p>
                <p className="legal-information-notice">
                    This page is not a complete policy document. No additional policy
                    terms are implied by this notice.
                </p>
                <div className="legal-information-actions">
                    <a href="mailto:info@ourmemoriesedutech.co.za">
                        Contact info@ourmemoriesedutech.co.za
                    </a>
                    <Link to="/">Return to home</Link>
                </div>
            </section>
        </main>
    );
}

export default LegalInformation;
