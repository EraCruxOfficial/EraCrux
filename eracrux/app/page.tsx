import Header1 from '@/components/mvpblocks/header-1';
import Globe3D from '@/components/mvpblocks/3dglobe';
import FeaturesSectionDemo from '@/components/homepage-components/features-section-demo-3';
import { Blog8 } from '@/components/homepage-components/blog8';
import FooterGlow from '@/components/mvpblocks/footer-glow';

export default function App() {
  return (
    <div className='bg-[#0a0613] font-light text-white antialiased min-h-screen' style={{
        background: 'linear-gradient(135deg, #0a0613 0%, #150d27 100%)',
      }}>
      <Header1 />
      <Globe3D />
      <FeaturesSectionDemo />
      <Blog8 />
      <FooterGlow />
    </div>
  );
}
