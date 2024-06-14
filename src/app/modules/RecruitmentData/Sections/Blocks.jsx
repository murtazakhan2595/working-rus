// Header.js
import React from "react";

function Block({ blocks }) {
    return (
        <>
            <Row className="flex items-center">
                {blocks && blocks.map(block => (
                    <SubBlock
                        label={block.label}
                        value={block.value}
                        image={block.image}
                    />
                ))}
            </Row>
        </>
    );
};
function SubBlock(label, value, image) {
    return (
        <Col md={6} className="mb-3">
            <div className="bg-[#FAFBFC] rounded-[20px] p-4 flex gap-x-[30px] m-1">
                <img src={image} alt="icon" />
                <div>
                    <h4 className="font-lato text-sm font-normal leading-normal text-baseGray">
                        {label}
                    </h4>
                    <h2 className="font-lato text-2xl text-[#323333] font-normal leading-normal">
                        {value}
                    </h2>
                </div>
            </div>
        </Col>
    )
}



export default Block;
