import React from 'react';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "../../../src/@/components/ui/breadcrumb";

const StyleGuide = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="screen p-6 space-y-8 bg-white rounded-lg shadow">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Style Guide</h1>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>Style Guide</BreadcrumbItem>
            </Breadcrumb>
          </div>

          {/* Colors */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Color System</h2>
            <div className="space-y-8">
              {/* Base Colors */}
              <div>
                <h3 className="text-lg font-medium mb-3">Base Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col">
                    <div className="p-4 bg-base-black text-base-white rounded-t">Base Black</div>
                    <div className="px-2 py-1 text-sm">Hex: #0A0A0B</div>
                    <div className="px-2 py-1 text-sm">HSL: 240 4% 5%</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="p-4 bg-base-white border-t border-x rounded-t">Base White</div>
                    <div className="px-2 py-1 text-sm">Hex: #FAFAFA</div>
                    <div className="px-2 py-1 text-sm">HSL: 0 0% 98%</div>
                  </div>
                </div>
              </div>

              {/* Input Colors */}
              <div>
                <h3 className="text-lg font-medium mb-3">Input Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col">
                    <div className="p-4 bg-[#FBEBFB] rounded-t">Hover</div>
                    <div className="px-2 py-1 text-sm">Hex: #FBEBFB</div>
                    <div className="px-2 py-1 text-sm">HSL: 300 67 95</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="p-4 bg-[#D9D9E0] rounded-t">Active/Muted</div>
                    <div className="px-2 py-1 text-sm">Hex: #D9D9E0</div>
                    <div className="px-2 py-1 text-sm">HSL: 240 10 86</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="p-4 bg-[#FBEBFB] rounded-t">Active/Primary</div>
                    <div className="px-2 py-1 text-sm">Hex: #FBEBFB</div>
                    <div className="px-2 py-1 text-sm">HSL: 300 67 95</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="p-4 bg-[#FACFD9] rounded-t">Active/Error</div>
                    <div className="px-2 py-1 text-sm">Hex: #FACFD9</div>
                    <div className="px-2 py-1 text-sm">HSL: 346 81 90</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="p-4 bg-[#F8E5CB] rounded-t">Active/Warning</div>
                    <div className="px-2 py-1 text-sm">Hex: #F8E5CB</div>
                    <div className="px-2 py-1 text-sm">HSL: 35 76 88</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="p-4 bg-[#CEF3EA] rounded-t">Active/Success</div>
                    <div className="px-2 py-1 text-sm">Hex: #CEF3EA</div>
                    <div className="px-2 py-1 text-sm">HSL: 165 61 88</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Row/Nav Colors */}
          

          {/* Text Interaction */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Text Interaction</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-3">Row / Menu</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Hover */}
                  <div className="flex flex-col gap-2">
                    <div className="p-4 bg-white  ">
                    <div className="text-neutral-1100 font-bold text-sm">Hover</div>
                      <div className="text-neutral-1100">Neutrals 1100</div>
                    
                      <div className="text-neutral-1100">Hex: #FBEBFB</div>
                      <div className="text-neutral-1100">HSL: 300 67 95</div>
                    </div>
                  </div>

                  {/* Active/Muted */}
                  <div className="flex flex-col">
                    <div className="p-4 bg-white  ">
                      <div className="text-neutral-1200 font-bold text-sm">Active/Muted</div>
                      <div className="text-neutral-1100">Neutrals 1100</div>
                 
                      <div className="text-neutral-1100">Hex: #D9D9E0</div>
                      <div className="text-neutral-1100">HSL: 240 10 86</div>
                    </div>
                  </div>

                  {/* Active/Primary */}
                  <div className="flex flex-col">
                    <div className="p-4 bg-white  ">
                    
                      <div className="text-primary-1100 font-bold text-sm">Primary 1100</div>
                    
                      <div className="text-primary-1100">Hex: #FBEBFB</div>
                      <div className="text-primary-1100">HSL: 300 67 95</div>
                    </div>
                  </div>

                  {/* Active/Error */}
                  <div className="flex flex-col">
                    <div className="p-4 bg-white  ">
                      <div className="text-error-500 font-bold text-sm">Error 500</div>
                  
                      <div className="text-error-500">Hex: #FACFD9</div>
                      <div className="text-error-500">HSL: 346 81 90</div>
                    </div>
                  </div>

                  {/* Active/Warning */}
                  <div className="flex flex-col">
                    <div className="p-4 bg-white  ">
                      <div className="text-warning-500 font-bold text-sm">Warning500</div>
                    
                      <div className="text-warning-500">Hex: #F8E5CB</div>
                      <div className="text-warning-500">HSL: 35 76 88</div>
                    </div>
                  </div>

                  {/* Active/Success */}
                  <div className="flex flex-col">
                    <div className="p-4 bg-white  ">
                      <div className="text-success-500 font-bold text-sm">Success 500</div>
                   
                      <div className="text-success-500">Hex: #CEF3EA</div>
                      <div className="text-success-500">HSL: 165 61 88</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StyleGuide;
