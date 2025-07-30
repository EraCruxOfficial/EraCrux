import Header1 from '@/components/mvpblocks/header-1';
import Globe3D from '@/components/mvpblocks/3dglobe';
import FeaturesSectionDemo from '@/components/features-section-demo-3';
import { Blog8 } from '@/components/blog8';
import FooterGlow from '@/components/mvpblocks/footer-glow';
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from '@/components/ui/kibo-ui/marquee';

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
      {/* <Marquee>
        <MarqueeFade side="left" />
        <MarqueeFade side="right" />
        <MarqueeContent>
          {new Array(10).fill(null).map((_, index) => (
            <MarqueeItem className="h-32 w-32" key={index}>
              <img
                alt={`Placeholder ${index}`}
                className="overflow-hidden rounded-full"
                src={`/excel.png`}
              />
            </MarqueeItem>
          ))}
        </MarqueeContent>
      </Marquee> */}
    </div>
  );
}
