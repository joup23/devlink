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
                <div className="mt-4 space-y-2">
                    <h4 className="font-medium text-gray-700">프로젝트</h4>
                    {career.projects.map((project, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                            <h4 className="font-semibold">{project.projectName}</h4>
                            {project.startDate && (
                                <p className="text-xs text-gray-500 mt-1">
                                    {formatYearMonth(project.startDate)} ~ {project.endDate ? formatYearMonth(project.endDate) : '현재'}
                                </p>
                            )}
                            <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {project.skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                    >
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CareerCard; 