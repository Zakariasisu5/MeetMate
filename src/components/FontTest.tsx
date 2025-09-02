import React from 'react';

const FontTest: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground font-heading mb-4">
          Font Test - Poppins (Heading)
        </h1>
        <p className="text-lg text-muted-foreground font-body">
          This is Nunito Sans (Body) - A friendly, readable font for body text.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground font-heading">
            Poppins Font Weights
          </h2>
          <div className="space-y-2">
            <p className="text-lg font-normal text-foreground font-heading">
              Poppins Regular (400) - Clean and modern
            </p>
            <p className="text-lg font-semibold text-foreground font-heading">
              Poppins Semibold (600) - Strong emphasis
            </p>
            <p className="text-lg font-bold text-foreground font-heading">
              Poppins Bold (700) - Maximum impact
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground font-heading">
            Nunito Sans Font Weights
          </h2>
          <div className="space-y-2">
            <p className="text-lg font-normal text-foreground font-body">
              Nunito Sans Regular (400) - Friendly and readable
            </p>
            <p className="text-lg font-semibold text-foreground font-body">
              Nunito Sans Semibold (600) - Gentle emphasis
            </p>
            <p className="text-lg font-bold text-foreground font-body">
              Nunito Sans Bold (700) - Clear hierarchy
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold text-foreground font-heading mb-4">
          Sample Content
        </h3>
        <div className="space-y-3 font-body text-foreground">
          <p>
            This is a sample paragraph using Nunito Sans for body text. It's designed to be 
            highly readable and friendly, making it perfect for longer content and user interfaces.
          </p>
          <p>
            The combination of Poppins for headings and Nunito Sans for body text creates a 
            modern, approachable design that feels both professional and welcoming.
          </p>
          <p>
            This typography pairing works well for applications that need to balance 
            technical functionality with human-centered design principles.
          </p>
        </div>
      </div>

      <div className="text-center">
        <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-body">
          Sample Button with Nunito Sans
        </button>
      </div>
    </div>
  );
};

export default FontTest;


