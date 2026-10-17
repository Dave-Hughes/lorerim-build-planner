"""
Spike: exports one item's .nif (pulled by fetch.py) as a .glb for a browser 3D viewer.

  blender --background --python scripts/renders/export_glb.py -- <item dir> <out.glb> [texture px]

Uses render.py's import, so the model is turned the way the game's inventory shows it and
scabbards and effect shapes are left out. PyNifly's shader nodes don't map onto glTF, so each mesh
gets a plain material: its diffuse texture (alpha only when the NIF's material used it) and its
normal map. Textures are shrunk to 1024 px (or the size given) and written as PNG inside the .glb.
"""
import os
import re
import sys

import bpy

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import render  # noqa: E402

NOT_DIFFUSE = re.compile(r"(_n|_msn|_m|_e|_p|_s|_g|_bl|envmask)\.dds$|cubemaps", re.I)


def images(mat):
    return [n.image for n in mat.node_tree.nodes if n.type == "TEX_IMAGE" and n.image] if mat and mat.use_nodes else []


def uses_alpha(mat, diffuse):
    """
    True when the NIF's material wires the diffuse texture's alpha into the shader's alpha (alpha
    test or blend). The normal map's alpha is the specular mask, not transparency.
    """
    return any(l.from_node.type == "TEX_IMAGE" and l.from_node.image == diffuse and l.from_socket.name == "Alpha" and "alpha" in l.to_socket.name.lower()
               for l in mat.node_tree.links)


def simple_material(o, size):
    old = o.active_material
    imgs = images(old)
    diffuse = next((i for i in imgs if not NOT_DIFFUSE.search(i.filepath)), None)
    normal = next((i for i in imgs if re.search(r"_n\.dds$", i.filepath, re.I)), None)
    mat = bpy.data.materials.new(o.name + "-glb")
    mat.use_nodes = True
    nodes, links = mat.node_tree.nodes, mat.node_tree.links
    bsdf = nodes["Principled BSDF"]
    bsdf.inputs["Roughness"].default_value = 0.55
    if normal:
        normal.colorspace_settings.name = "Non-Color"  # before scaling: changing it reloads the file
    for img in (diffuse, normal):
        if img and max(img.size) > size:
            img.scale(size, size * img.size[1] // img.size[0])
    if diffuse:
        tex = nodes.new("ShaderNodeTexImage")
        tex.image = diffuse
        links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
        if old and uses_alpha(old, diffuse):
            links.new(tex.outputs["Alpha"], bsdf.inputs["Alpha"])
    if normal:
        tex = nodes.new("ShaderNodeTexImage")
        tex.image = normal
        nm = nodes.new("ShaderNodeNormalMap")
        links.new(tex.outputs["Color"], nm.inputs["Color"])
        links.new(nm.outputs["Normal"], bsdf.inputs["Normal"])
    o.data.materials.clear()
    o.data.materials.append(mat)
    return diffuse, normal


def main():
    args = sys.argv[sys.argv.index("--") + 1:]
    item, out = os.path.abspath(args[0]), os.path.abspath(args[1])
    size = int(args[2]) if len(args) > 2 else 1024
    render.clear()
    nif, meshes = render.load(item)
    render.frame(meshes)
    bpy.context.view_layer.update()
    bpy.ops.object.select_all(action="DESELECT")
    for o in meshes:
        d, n = simple_material(o, size)
        print("GLB", o.name, "diffuse", d and os.path.basename(d.filepath), "normal", n and os.path.basename(n.filepath))
        o.select_set(True)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=out, export_format="GLB", use_selection=True, export_apply=True, export_skins=False,
                              export_animations=False, export_image_format="AUTO", export_yup=True)
    print("GLB wrote", out, os.path.getsize(out) // 1024, "KB")


main()
