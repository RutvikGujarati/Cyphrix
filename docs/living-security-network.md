# Living Security Network architecture

The redesign keeps the existing React/Vite routing, JSON content, email/OTP APIs, project modal, external links, and document downloads intact. Presentation is layered around those contracts rather than replacing them.

## Shared visual system

- `SecurityCanvas.tsx` is the only active WebGL canvas. It is dynamically imported by `App.tsx` and persists between routes.
- Route state selects the default scene: decomposition for Services, scanning for Flow of Audit, verified modules for Projects, experimental topology for R&D, and handshake for Partner/Contact/Audit Request.
- Homepage sections use `data-network-state` to change the same scene as the reader scrolls.
- Project, service, and research rows dispatch a small focus event that highlights a corresponding network layer without coupling content components to Three.js.
- Repeated nodes use instancing. Connection paths use a single line-segment geometry per layer. DPR and node density are reduced on mobile, and no post-processing or real-time shadows are used.
- The frame loop stops work while the document is hidden. Reduced-motion mode freezes ambient camera and topology movement while preserving the current readable state.

## Progressive enhancement

The network is decorative and hidden from assistive technology. All headings, services, project details, audit steps, research content, links, and forms remain semantic HTML. A CSS network glow remains if WebGL cannot initialize.

## Motion and interaction

Framer Motion remains the only DOM animation dependency. Controls use short feedback, content uses restrained reveal motion, and the canvas uses slow weighted interpolation. The custom cursor is limited to fine-pointer devices and is disabled for touch and reduced-motion users.

## Content and functionality

Business copy stays in the existing page components and JSON files. Existing routes, navigation destinations, OTP verification, email submission, modal behavior, audit report links, social links, and brochure links are preserved.
