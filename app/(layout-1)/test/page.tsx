"use client"


import React, { useState } from 'react';
import { Camera, Lightbulb, Palette, Target, Film, Sparkles, Copy, Download } from 'lucide-react';

const PromptGenerator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [promptData, setPromptData] = useState({
    emotion: '',
    subject: '',
    background: '',
    texture: '',
    cameraAngle: '',
    lens: '',
    depthOfField: '',
    lightingType: '',
    lightingQuality: '',
    lightingColor: '',
    movement: '',
    colorGrade: '',
    customDetails: ''
  });

  const totalSteps = 8;

  const updatePromptData = (field, value) => {
    setPromptData(prev => ({ ...prev, [field]: value }));
  };

  const generateFinalPrompt = () => {
    const parts = [];
    
    // Core subject and emotion
    if (promptData.subject) parts.push(promptData.subject);
    if (promptData.emotion) parts.push(`${promptData.emotion} mood`);
    
    // Camera settings
    if (promptData.cameraAngle) parts.push(promptData.cameraAngle);
    if (promptData.lens) parts.push(`${promptData.lens} lens`);
    if (promptData.depthOfField) parts.push(promptData.depthOfField);
    
    // Lighting setup
    const lighting = [promptData.lightingType, promptData.lightingQuality, promptData.lightingColor].filter(Boolean).join(' ');
    if (lighting) parts.push(lighting);
    
    // Environment and texture
    if (promptData.background) parts.push(promptData.background);
    if (promptData.texture) parts.push(promptData.texture);
    
    // Movement and effects
    if (promptData.movement) parts.push(promptData.movement);
    if (promptData.colorGrade) parts.push(promptData.colorGrade);
    
    // Custom details
    if (promptData.customDetails) parts.push(promptData.customDetails);
    
    // Professional suffixes
    parts.push('professional photography', 'studio quality', 'high resolution', 'cinematic composition');
    
    return parts.join(', ');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateFinalPrompt());
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[...Array(totalSteps)].map((_, i) => (
        <div key={i} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
            i + 1 <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div className={`w-12 h-1 mx-2 transition-colors ${
              i + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const OptionButton = ({ value, current, onClick, children }) => (
    <button
      onClick={() => onClick(value)}
      className={`p-3 rounded-lg border text-left transition-all hover:border-blue-300 ${
        current === value ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  );

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Step 1: Story & Emotion</h2>
              <p className="text-gray-600">What feeling are we trying to create? This controls everything that follows.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3">What are we shooting?</label>
              <input
                type="text"
                placeholder="e.g., luxury perfume bottle, skincare product, person, architectural detail"
                className="w-full p-3 border rounded-lg"
                value={promptData.subject}
                onChange={(e) => updatePromptData('subject', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Key Emotion/Theme</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['luxurious', 'dreamy', 'dramatic', 'clean', 'moody', 'energetic', 'elegant', 'mysterious', 'warm'].map(emotion => (
                  <OptionButton
                    key={emotion}
                    value={emotion}
                    current={promptData.emotion}
                    onClick={(value) => updatePromptData('emotion', value)}
                  >
                    <div className="font-medium capitalize">{emotion}</div>
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Palette className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Step 2: Background & Texture</h2>
              <p className="text-gray-600">Design the world that supports your story. Background is your second character.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3">Background/Environment</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'minimalist white studio backdrop',
                  'textured concrete wall',
                  'soft gradient background',
                  'natural outdoor setting',
                  'luxurious marble surface',
                  'industrial metal backdrop',
                  'organic wood texture',
                  'ethereal mist background'
                ].map(bg => (
                  <OptionButton
                    key={bg}
                    value={bg}
                    current={promptData.background}
                    onClick={(value) => updatePromptData('background', value)}
                  >
                    {bg}
                  </OptionButton>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Surface Texture/Material</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['glossy', 'matte', 'frosted glass', 'velvet', 'metallic', 'weathered', 'smooth marble', 'rough concrete'].map(texture => (
                  <OptionButton
                    key={texture}
                    value={texture}
                    current={promptData.texture}
                    onClick={(value) => updatePromptData('texture', value)}
                  >
                    {texture}
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Camera className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Step 3: Camera Angle</h2>
              <p className="text-gray-600">Where are we placing the camera? Each angle tells a different story.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'eye level shot', desc: 'Natural, relatable perspective' },
                { value: 'low angle shot', desc: 'Makes subject powerful, dramatic' },
                { value: 'high angle shot', desc: 'Overview, elegant perspective' },
                { value: 'close-up shot', desc: 'Intimate, detail-focused' },
                { value: 'extreme close-up', desc: 'Ultra-detailed, texture focus' },
                { value: 'wide establishing shot', desc: 'Shows full environment' },
                { value: 'three-quarter angle', desc: 'Dynamic, professional product angle' },
                { value: 'overhead flat lay', desc: 'Editorial, organized layout' }
              ].map(angle => (
                <OptionButton
                  key={angle.value}
                  value={angle.value}
                  current={promptData.cameraAngle}
                  onClick={(value) => updatePromptData('cameraAngle', value)}
                >
                  <div className="font-medium">{angle.value}</div>
                  <div className="text-sm text-gray-600">{angle.desc}</div>
                </OptionButton>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Film className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Step 4: Lens & Depth</h2>
              <p className="text-gray-600">Choose your camera's "eye" and what stays sharp vs blurry.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3">Lens Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: '85mm', desc: 'Portrait lens, natural compression' },
                  { value: '50mm', desc: 'Natural perspective, versatile' },
                  { value: '35mm', desc: 'Wider view, environmental context' },
                  { value: '24mm', desc: 'Wide angle, dramatic perspective' },
                  { value: '100mm macro', desc: 'Extreme detail, close-up work' },
                  { value: '135mm', desc: 'Telephoto compression, isolation' }
                ].map(lens => (
                  <OptionButton
                    key={lens.value}
                    value={lens.value}
                    current={promptData.lens}
                    onClick={(value) => updatePromptData('lens', value)}
                  >
                    <div className="font-medium">{lens.value}</div>
                    <div className="text-sm text-gray-600">{lens.desc}</div>
                  </OptionButton>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Depth of Field</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: 'shallow depth of field f/1.4', desc: 'Subject sharp, dreamy blurred background' },
                  { value: 'medium depth of field f/4', desc: 'Subject clear, background softly blurred' },
                  { value: 'deep depth of field f/8', desc: 'Everything sharp and detailed' },
                  { value: 'bokeh background', desc: 'Creamy, artistic background blur' }
                ].map(depth => (
                  <OptionButton
                    key={depth.value}
                    value={depth.value}
                    current={promptData.depthOfField}
                    onClick={(value) => updatePromptData('depthOfField', value)}
                  >
                    <div className="font-medium">{depth.value}</div>
                    <div className="text-sm text-gray-600">{depth.desc}</div>
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Lightbulb className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Step 5: Lighting Setup</h2>
              <p className="text-gray-600">Light is emotion. This changes the mood more than anything else.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3">Lighting Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: 'natural window light', desc: 'Soft, authentic, flattering' },
                  { value: 'dramatic side lighting', desc: 'Strong shadows, mysterious mood' },
                  { value: 'soft key light', desc: 'Professional, even illumination' },
                  { value: 'backlighting', desc: 'Rim light, ethereal glow' },
                  { value: 'studio strobe lighting', desc: 'Controlled, powerful, clean' },
                  { value: 'golden hour light', desc: 'Warm, magical, cinematic' }
                ].map(light => (
                  <OptionButton
                    key={light.value}
                    value={light.value}
                    current={promptData.lightingType}
                    onClick={(value) => updatePromptData('lightingType', value)}
                  >
                    <div className="font-medium">{light.value}</div>
                    <div className="text-sm text-gray-600">{light.desc}</div>
                  </OptionButton>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Light Quality</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['soft diffused', 'hard directional', 'volumetric rays', 'rim lighting'].map(quality => (
                  <OptionButton
                    key={quality}
                    value={quality}
                    current={promptData.lightingQuality}
                    onClick={(value) => updatePromptData('lightingQuality', value)}
                  >
                    {quality}
                  </OptionButton>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Light Color Temperature</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['warm golden', 'cool blue', 'neutral white', 'amber tungsten'].map(color => (
                  <OptionButton
                    key={color}
                    value={color}
                    current={promptData.lightingColor}
                    onClick={(value) => updatePromptData('lightingColor', value)}
                  >
                    {color}
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Sparkles className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Step 6: Movement & Effects</h2>
              <p className="text-gray-600">Add motion and cinematic effects to bring your image to life.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3">Movement/Motion Effects</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: 'motion blur on edges', desc: 'Dynamic movement, speed' },
                  { value: 'lens flare', desc: 'Cinematic light streaks' },
                  { value: 'chromatic aberration', desc: 'Color separation, artistic edge' },
                  { value: 'film grain texture', desc: 'Analog, authentic feel' },
                  { value: 'floating particles', desc: 'Magical, ethereal atmosphere' },
                  { value: 'subtle camera shake', desc: 'Handheld, authentic feel' },
                  { value: 'static composition', desc: 'Locked off, controlled, stable' },
                  { value: 'dynamic tilt', desc: 'Dutch angle, energy, tension' }
                ].map(movement => (
                  <OptionButton
                    key={movement.value}
                    value={movement.value}
                    current={promptData.movement}
                    onClick={(value) => updatePromptData('movement', value)}
                  >
                    <div className="font-medium">{movement.value}</div>
                    <div className="text-sm text-gray-600">{movement.desc}</div>
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Palette className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Step 7: Color Grade & Mood</h2>
              <p className="text-gray-600">Paint your image with color to tell the final emotional story.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3">Color Grading Style</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: 'warm cinematic grade', desc: 'Orange/teal, blockbuster feel' },
                  { value: 'desaturated film look', desc: 'Muted colors, sophisticated' },
                  { value: 'high contrast black and white', desc: 'Dramatic, timeless' },
                  { value: 'vibrant saturated colors', desc: 'Bold, energetic, modern' },
                  { value: 'cool blue tones', desc: 'Clean, tech, professional' },
                  { value: 'vintage film emulation', desc: 'Nostalgic, authentic grain' },
                  { value: 'natural color balance', desc: 'True to life, realistic' },
                  { value: 'monochromatic color scheme', desc: 'Single color family, elegant' }
                ].map(grade => (
                  <OptionButton
                    key={grade.value}
                    value={grade.value}
                    current={promptData.colorGrade}
                    onClick={(value) => updatePromptData('colorGrade', value)}
                  >
                    <div className="font-medium">{grade.value}</div>
                    <div className="text-sm text-gray-600">{grade.desc}</div>
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Step 8: Final Touches</h2>
              <p className="text-gray-600">Add any specific details or adjustments to perfect your vision.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3">Custom Details (Optional)</label>
              <textarea
                placeholder="Add any specific details: brand colors, specific angles, props, styling notes, etc."
                className="w-full p-3 border rounded-lg h-24"
                value={promptData.customDetails}
                onChange={(e) => updatePromptData('customDetails', e.target.value)}
              />
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Your Generated Prompt:</h3>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-sm leading-relaxed">{generateFinalPrompt()}</p>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy Prompt
                </button>
                <button
                  onClick={() => {
                    const element = document.createElement('a');
                    const file = new Blob([generateFinalPrompt()], {type: 'text/plain'});
                    element.href = URL.createObjectURL(file);
                    element.download = 'ai-prompt.txt';
                    element.click();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Visual Prompt Generator</h1>
        <p className="text-lg text-gray-600">Build consistency through structure. Think like a cinematographer, not a lottery player.</p>
      </div>

      <StepIndicator />
      
      <div className="bg-white rounded-xl shadow-sm border p-8">
        {renderStep()}
        
        <div className="flex justify-between mt-8 pt-6 border-t">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-lg transition-colors ${
              currentStep === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
            disabled={currentStep === totalSteps}
            className={`px-6 py-2 rounded-lg transition-colors ${
              currentStep === totalSteps 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {currentStep === totalSteps ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>💡 Pro Tip: Save your generated prompts and iterate. Adjust one element at a time for consistent results.</p>
      </div>
    </div>
  );
};

export default PromptGenerator;