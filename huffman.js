var freq_history = [];
var enc_dict = {};
var dec_dict = {};
var frequency = [];
var w=0;
var str;
function TreeNode(chr, freq)
{
	this.chr = chr;
	this.freq = freq;
	this.left = null;
	this.right = null;
}

function insert(arr, node)
{
	if (arr.length == 0)
	{
		arr.push(node);
	}
	else
	{
		var flag = false;
		for(i=0; i < arr.length; i++)
		{
			if (node.freq > arr[i].freq)
			{
				arr.splice(i, 0, node);
				flag = true;
				break;
			}
		}
		if (!flag)
		{
			arr.push(node);
		}
	}
}

function compare(a,b) {
	if (a.freq > b.freq)
		return -1;
	if (a.freq < b.freq)
		return 1;
	return 0;
}

function make_tree(frequency)
{
	frequency.sort(compare);
	freq_history.push(freq_to_string(frequency));
	while (frequency.length > 1)
	{
		right = frequency.pop();
		left = frequency.pop();
		new_node = new TreeNode(left.chr + right.chr, left.freq + right.freq);
		new_node.left = left;
		new_node.right = right;
		insert(frequency, new_node);
		freq_history.push(freq_to_string(frequency));
	}
}

function make_codes_helper(root, dict, revdict, current_code){
	if (root != null){
		if (root.left == null && root.right == null)
		{
			dict[root.chr] = current_code;
			revdict[current_code] = root.chr;
		}else{
			make_codes_helper(root.left, dict, revdict, current_code + "0");
			make_codes_helper(root.right, dict,revdict, current_code + "1");
		}
	}
}

function make_digraph_helper(root, list){
	if (root.left != null)
	{
		list.push(root.chr + ' -> ' + root.left.chr + ' [ label = 0 ];');
		make_digraph_helper(root.left, list);
	}
	if (root.right != null)
	{
		list.push(root.chr + ' -> ' + root.right.chr + ' [ label = 1 ];');
		make_digraph_helper(root.right, list);
	}
}

function make_frequency(str)
{
	dict = {};
	for (i=0; i < str.length; i++){
		if (dict[str[i]] === undefined)
		{
			dict[str[i]] = 0;
		}
		dict[str[i]]++;
	}
	frequency = [];
	for (var key in dict) {
		frequency.push(new TreeNode(key, dict[key]));
	}
	return frequency;
}

function make_digraph(root)
{
	list = [];
	make_digraph_helper(root, list);
	return list.join(' ');
}

function freq_to_string(freq)
{
	var resp = "";
	for(i=0; i<freq.length; i++){
		resp+= freq[i].chr + " : " + freq[i].freq + '\n';
	}
	return resp;
}
function encode(text)
{
	encoded_text = "";
	for(i=0;i<text.length;i++)
	{
		encoded_text += enc_dict[text[i]]
	}
	return encoded_text
}

function decode(text)
{
	current_code = "";
	decoded_text = "";

	for(i=0;i<text.length;i++)
	{
		current_code += text[i];
		if(current_code in dec_dict)
		{
			character = dec_dict[current_code];
			decoded_text += character;
			current_code = "";
		}
	}
	return decoded_text;
}

function gerar()
{
	w=0
	freq_history=[];
	enc_dict = {};
	dec_dict = {};
	frequency = [];
	var str = document.getElementById("plaintext").value;
	frequency = make_frequency(str);
	make_tree(frequency);
	make_codes_helper(frequency[0], enc_dict, dec_dict, "");
		for(i=0; i<freq_history.length;i++){
		console.log(freq_history[i]);
	}
	d3.select("#graph").graphviz()
    .fade(false)
    .renderDot('digraph  {' + make_digraph(frequency[0]) + '}');
    $("#hist_freq").text(freq_history[w]);
}

function hist_prox()
{
	if(w<freq_history.length)
		w++;
	$("#hist_freq").text(freq_history[w]);
	
}
function hist_ant()
{
	if(w>0)
		w--;
	$("#hist_freq").text(freq_history[w]);
}

function show_code()
{
	str = document.getElementById("plaintext").value;
	$("#texto_saida").text(encode(str));

}

function show_decode()
{
	str = document.getElementById("plaintext").value;
	$("#texto_saida").text(decode(str));
}

