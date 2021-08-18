import React from 'react';
import { Grid } from '@alifd/next';

const { Row, Col } = Grid;
interface IProps {
  dataSource: Object;
}
export default function HscodeGuilei(props: IProps) {
  const deDataSource = props.dataSource||{"a b":"c", "aaaa":"bbb","aa b":"c", "aaaas":"bbb","ad b":"c", "aacaa":"bbb"}
  const _a = Object.keys(deDataSource)

  return (
      <div style={{width:'100%'}}>
        <Row wrap>
          {_a.map((item,i)=>{
            return (<>
              <Col span="3" style={{
                height: "44px",
                background: "#F6F6F6",
                border: "1px solid #E3E3E3",
                backgroundColor: "#F6F6F6",
                textIndent:"28px",
                lineHeight:"44px",
                fontSize: "14px",
                fontFamily: "PingFangSC-Medium",
                color: "#333333"
              }}>{item+'：'}</Col>
              <Col span="9" style={{
                height: "44px",
                border: "1px solid #E3E3E3",
                textIndent:"20px",
                lineHeight:"44px",
                fontSize: "14px",
                color: "#666666"
              }}>{deDataSource[item]}</Col>
            </>)
          })}
        </Row>
      </div>
  );
}
