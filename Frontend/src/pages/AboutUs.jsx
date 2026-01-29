import { FaReact, FaCode, FaLeaf } from 'react-icons/fa';
import { SiTailwindcss, SiVite } from 'react-icons/si';

const AboutUs = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold text-dark">About <span className="text-primary">BirdID</span></h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    A cutting-edge bird identification system designed for researchers, nature enthusiasts, and students.
                </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-secondary"><FaLeaf /></span> Our Mission
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                    Our mission is to bridge the gap between technology and nature conservation. By providing an easy-to-use tool for identifying bird species, we aim to encourage wildlife education and support ornithological research.
                </p>
                <p className="text-gray-600 leading-relaxed">
                    This project uses advanced image recognition techniques to analyze bird photos and provide accurate species information, helping users learn more about the biodiversity around them.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span className="text-blue-500"><FaCode /></span> Tech Stack
                    </h2>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3 text-gray-700">
                            <FaReact className="text-2xl text-blue-400" />
                            <span><strong>React.js</strong> - Frontend Framework</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                            <SiVite className="text-2xl text-purple-500" />
                            <span><strong>Vite</strong> - Build Tool</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                            <SiTailwindcss className="text-2xl text-cyan-400" />
                            <span><strong>Tailwind CSS</strong> - Styling Engine</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                             <div className="text-2xl font-bold text-gray-500">AI</div>
                            <span><strong>CNN / ML</strong> - Image Processing (Simulated)</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm">
                     <h2 className="text-2xl font-bold mb-6">Research Benefits</h2>
                     <ul className="space-y-3 list-disc list-inside text-gray-600">
                        <li>Rapid species identification in the field</li>
                        <li>Digital archiving of bird sightings</li>
                        <li>Educational resource for students</li>
                        <li>Data collection for population studies</li>
                     </ul>
                </div>
            </div>
            
            <div className="text-center text-gray-400 text-sm pt-8 border-t border-gray-200">
                <p>&copy; {new Date().getFullYear()} Bird Identification System. All rights reserved.</p>
            </div>
        </div>
    );
};

export default AboutUs;
