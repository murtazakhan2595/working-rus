import React from "react";
import { Row, Col } from 'reactstrap';

const Blocks = ({ blocks }) => {
    return (
        <Row className="flex items-center">
            {blocks && blocks.map((block, index) => (
                <SubBlock key={index} label={block.label} value={block.value} image={block.image} />
            ))}
        </Row>
    );
};

const SubBlock = ({ label, value, image }) => {
    return (
        <Col md={6} className="mb-2">
            <div className="bg-[#FAFBFC] rounded-[20px] px-3 py-4 flex gap-x-[20px]">
                <img src={image} alt="icon" />
                <div>
                    <h4 className=" text-sm font-normal leading-normal text-baseGray">
                        {label}
                    </h4>
                    <h2 className=" text-2xl text-[#323333] font-normal leading-normal">
                        {value}
                    </h2>
                </div>
            </div>
        </Col>
    );
};

export default Blocks;
