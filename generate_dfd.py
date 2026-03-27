import xml.etree.ElementTree as ET

def build_level_0():
    xml = []
    xml.append('<diagram id="level_0" name="Level 0 DFD">')
    xml.append('<mxGraphModel dx="1000" dy="1000" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">')
    xml.append('<root>')
    xml.append('<mxCell id="0" />')
    xml.append('<mxCell id="1" parent="0" />')
    
    xml.append('<mxCell id="u0" value="User" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="50" y="200" width="100" height="150" as="geometry" /></mxCell>')
    xml.append('<mxCell id="a0" value="Admin" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="700" y="200" width="100" height="150" as="geometry" /></mxCell>')
    xml.append('<mxCell id="s0" value="0.0&lt;br&gt;&lt;br&gt;Bird Identification&lt;br&gt;System" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="340" y="150" width="180" height="250" as="geometry" /></mxCell>')
    
    rels_us = [
        ("Register / Login Request", 0.05, 0.1, "u0", "s0", 1, 0),
        ("Upload Image Request", 0.25, 0.3, "u0", "s0", 1, 0),
        ("History Log Request", 0.45, 0.5, "u0", "s0", 1, 0),
        ("Auth Success/Fail", 0.65, 0.65, "s0", "u0", 0, 1),
        ("Prediction Results &amp; Bird Details", 0.8, 0.85, "s0", "u0", 0, 1),
        ("Sighting History List", 0.95, 0.95, "s0", "u0", 0, 1)
    ]
    for i, (val, y1, y2, src, tgt, sx, tx) in enumerate(rels_us):
        xml.append(f'<mxCell id="e_us_{i}" value="{val}" style="edgeStyle=orthogonalEdgeStyle;html=1;exitX={sx};exitY={y1};entryX={tx};entryY={y2};" edge="1" parent="1" source="{src}" target="{tgt}"><mxGeometry relative="1" as="geometry" /></mxCell>')

    rels_sa = [
        ("Admin Login Request", 0.1, 0.15, "a0", "s0", 0, 1),
        ("Suspend User / Actions", 0.4, 0.45, "a0", "s0", 0, 1),
        ("Request Analytics Stats", 0.7, 0.75, "a0", "s0", 0, 1),
        ("Admin Auth Status", 0.3, 0.3, "s0", "a0", 1, 0),
        ("Action Confirmed", 0.6, 0.6, "s0", "a0", 1, 0),
        ("System Stats &amp; Dash Data", 0.9, 0.9, "s0", "a0", 1, 0)
    ]
    for i, (val, y1, y2, src, tgt, sx, tx) in enumerate(rels_sa):
        xml.append(f'<mxCell id="e_sa_{i}" value="{val}" style="edgeStyle=orthogonalEdgeStyle;html=1;exitX={sx};exitY={y1};entryX={tx};entryY={y2};" edge="1" parent="1" source="{src}" target="{tgt}"><mxGeometry relative="1" as="geometry" /></mxCell>')

    xml.append('</root></mxGraphModel></diagram>')
    return "\n".join(xml)

def build_level_1():
    xml = []
    xml.append('<diagram id="level_1" name="Level 1 DFD">')
    xml.append('<mxGraphModel dx="1000" dy="1000" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1100" pageHeight="1169" math="0" shadow="0">')
    xml.append('<root>')
    xml.append('<mxCell id="0" />')
    xml.append('<mxCell id="1" parent="0" />')
    
    xml.append('<mxCell id="u1" value="User" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="50" y="270" width="100" height="280" as="geometry" /></mxCell>')
    xml.append('<mxCell id="a1" value="Admin" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="880" y="270" width="100" height="280" as="geometry" /></mxCell>')
    
    xml.append('<mxCell id="p1" value="1.0&lt;br&gt;&lt;br&gt;Auth &amp;amp; Registration&lt;br&gt;Process" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="350" y="80" width="160" height="110" as="geometry" /></mxCell>')
    xml.append('<mxCell id="p2" value="2.0&lt;br&gt;&lt;br&gt;Prediction &amp;amp; Bird Info&lt;br&gt;Process" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="350" y="270" width="160" height="110" as="geometry" /></mxCell>')
    xml.append('<mxCell id="p3" value="3.0&lt;br&gt;&lt;br&gt;History &amp;amp; Sighting&lt;br&gt;Process" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="350" y="460" width="160" height="110" as="geometry" /></mxCell>')
    xml.append('<mxCell id="p4" value="4.0&lt;br&gt;&lt;br&gt;Admin Dashboard&lt;br&gt;Process" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="350" y="650" width="160" height="110" as="geometry" /></mxCell>')

    ds_style = "shape=partialRectangle;html=1;whiteSpace=wrap;top=1;bottom=1;left=0;right=0;"
    xml.append(f'<mxCell id="d1" value="D1 : Users DB" style="{ds_style}" vertex="1" parent="1"><mxGeometry x="680" y="115" width="110" height="40" as="geometry" /></mxCell>')
    xml.append(f'<mxCell id="d2" value="D2 : Birds Details DB" style="{ds_style}" vertex="1" parent="1"><mxGeometry x="680" y="305" width="110" height="40" as="geometry" /></mxCell>')
    xml.append(f'<mxCell id="d3" value="D3 : Sightings History DB" style="{ds_style}" vertex="1" parent="1"><mxGeometry x="680" y="495" width="110" height="40" as="geometry" /></mxCell>')

    edges = [
        ("Register/Login", "u1", "p1", 1, 0, 0.1, 0.25),
        ("Auth Confirmed", "p1", "u1", 0, 1, 0.75, 0.2),
        ("Image Upload", "u1", "p2", 1, 0, 0.35, 0.25),
        ("Prediction Detail", "p2", "u1", 0, 1, 0.75, 0.45),
        ("Get History", "u1", "p3", 1, 0, 0.6, 0.25),
        ("History Array", "p3", "u1", 0, 1, 0.75, 0.7),
        ("Admin Login", "a1", "p1", 0, 1, 0.1, 0.15),
        ("Admin Confirmed", "p1", "a1", 1, 0, 0.6, 0.2),
        ("Suspend Action", "a1", "p4", 0, 1, 0.4, 0.25),
        ("Action Resolved", "p4", "a1", 1, 0, 0.3, 0.6),
        ("Request Stats", "a1", "p4", 0, 1, 0.85, 0.75),
        ("Stats Render", "p4", "a1", 1, 0, 0.8, 0.95),
        ("Save/Tokenize USer", "p1", "d1", 1, 0, 0.25, 0.25),
        ("User Verified", "d1", "p1", 0, 1, 0.75, 0.8),
        ("Fetch Encyclopedia", "p2", "d2", 1, 0, 0.25, 0.25),
        ("Bird Facts Res", "d2", "p2", 0, 1, 0.75, 0.8),
        ("Record new Sighting", "p2", "d3", 1, 0.05, 0.85, 0),
        ("Query Sightings", "p3", "d3", 1, 0, 0.25, 0.25),
        ("Sightings Data", "d3", "p3", 0, 1, 0.75, 0.8),
        ("Review Users", "p4", "d1", 1, 0.5, 0.1, 1),
        ("User Mod OK", "d1", "p4", 0.8, 1, 1, 0.4),
        ("Request Analytics", "p4", "d3", 1, 0.3, 0.5, 1),
        ("Aggregated Stats", "d3", "p4", 0.7, 1, 1, 0.6)
    ]
    for i, (val, src, tgt, sx, tx, sy, ty) in enumerate(edges):
        xml.append(f'<mxCell id="e_1_{i}" value="{val}" style="edgeStyle=orthogonalEdgeStyle;html=1;exitX={sx};exitY={sy};entryX={tx};entryY={ty};" edge="1" parent="1" source="{src}" target="{tgt}"><mxGeometry relative="1" as="geometry" /></mxCell>')

    xml.append('</root></mxGraphModel></diagram>')
    return "\n".join(xml)

def main():
    try:
        with open(r"c:\\Users\\Legion\\Desktop\\Project6\\BIRD_SYSTEM_DFD.drawio", "w") as f:
            f.write('<mxfile host="Electron" modified="2024-03-26T00:00:00.000Z" agent="Mozilla/5.0" version="21.1.2" type="device">\n')
            f.write(build_level_0() + "\n")
            f.write(build_level_1() + "\n")
            f.write('</mxfile>')
        print("Success")
    except Exception as e:
        print("Error:", str(e))

if __name__ == "__main__":
    main()
