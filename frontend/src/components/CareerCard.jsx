import React from 'react';
import { formatYearMonth } from '../utils/dateUtils';

const CareerCard = ({ career }) => {
    return (
        <div className="border rounded-lg p-4">
            <div>
                <h3 className="text-lg font-semibold">{career.companyName}</h3>
                <p className="text-gray-600">
                    {career.department} - {career.position}
                </p>
                <p className="text-sm text-gray-500">
                    {formatYearMonth(career.startDate)} ~ {career.endDate ? formatYearMonth(career.endDate) : '현재'}
                </p>
                {career.description && (
                    <div className="mt-2">
                        <p className="text-gray-700 whitespace-pre-line">{career.description}</p>
                    </div>
                )}
            </div>

            {/* 경력 내 프로젝트 목록 */}
            {career.projects && career.projects.length > 0 && (
                <div className="mt-6">
                    <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">프로젝트</h4>
                    <div className="space-y-4">
                        {career.projects.map((project, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-gray-900">{project.projectName}</h4>
                                    {project.startDate && (
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {formatYearMonth(project.startDate)} ~ {project.endDate ? formatYearMonth(project.endDate) : '현재'}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {project.skills.map((skill, i) => (
                                        <span
                                            key={i}
                                            className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium"
                                        >
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CareerCard; 